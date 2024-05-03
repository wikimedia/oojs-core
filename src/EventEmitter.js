/* global hasOwn */

( function () {

	/**
	 * @class
	 */
	OO.EventEmitter = function OoEventEmitter() {
		// Properties

		/**
		 * Storage of bound event handlers by event name.
		 *
		 * @private
		 * @property {Object} bindings
		 */
		this.bindings = {};
	};

	OO.initClass( OO.EventEmitter );

	/* Private helper functions */

	/**
	 * Validate a function or method call in a context
	 *
	 * For a method name, check that it names a function in the context object
	 *
	 * @private
	 * @param {Function|string} method Function or method name
	 * @param {any} context The context of the call
	 * @throws {Error} A method name is given but there is no context
	 * @throws {Error} In the context object, no property exists with the given name
	 * @throws {Error} In the context object, the named property is not a function
	 */
	function validateMethod( method, context ) {
		// Validate method and context
		if ( typeof method === 'string' ) {
			// Validate method
			if ( context === undefined || context === null ) {
				throw new Error( 'Method name "' + method + '" has no context.' );
			}
			if ( typeof context[ method ] !== 'function' ) {
				// Technically the property could be replaced by a function before
				// call time. But this probably signals a typo.
				throw new Error( 'Property "' + method + '" is not a function' );
			}
		} else if ( typeof method !== 'function' ) {
			throw new Error( 'Invalid callback. Function or method name expected.' );
		}
	}

	/**
	 * @private
	 * @param {OO.EventEmitter} eventEmitter Event emitter
	 * @param {string} event Event name
	 * @param {Object} binding
	 */
	function addBinding( eventEmitter, event, binding ) {
		let bindings;
		// Auto-initialize bindings list
		if ( hasOwn.call( eventEmitter.bindings, event ) ) {
			bindings = eventEmitter.bindings[ event ];
		} else {
			bindings = eventEmitter.bindings[ event ] = [];
		}
		// Add binding
		bindings.push( binding );
	}

	/* Methods */

	/**
	 * Add a listener to events of a specific event.
	 *
	 * The listener can be a function or the string name of a method; if the latter, then the
	 * name lookup happens at the time the listener is called.
	 *
	 * @param {string} event Type of event to listen to
	 * @param {Function|string} method Function or method name to call when event occurs
	 * @param {Array} [args] Arguments to pass to listener, will be prepended to emitted arguments
	 * @param {Object} [context=null] Context object for function or method call
	 * @return {OO.EventEmitter}
	 * @throws {Error} Listener argument is not a function or a valid method name
	 */
	OO.EventEmitter.prototype.on = function ( event, method, args, context ) {
		validateMethod( method, context );

		// Ensure consistent object shape (optimisation)
		addBinding( this, event, {
			method: method,
			args: args,
			context: ( arguments.length < 4 ) ? null : context,
			once: false
		} );
		return this;
	};

	/**
	 * Add a one-time listener to a specific event.
	 *
	 * @param {string} event Type of event to listen to
	 * @param {Function} listener Listener to call when event occurs
	 * @return {OO.EventEmitter}
	 */
	OO.EventEmitter.prototype.once = function ( event, listener ) {
		validateMethod( listener );

		// Ensure consistent object shape (optimisation)
		addBinding( this, event, {
			method: listener,
			args: undefined,
			context: null,
			once: true
		} );
		return this;
	};

	/**
	 * Remove a specific listener from a specific event.
	 *
	 * @param {string} event Type of event to remove listener from
	 * @param {Function|string} [method] Listener to remove. Must be in the same form as was passed
	 * to "on". Omit to remove all listeners.
	 * @param {Object} [context=null] Context object function or method call
	 * @return {OO.EventEmitter}
	 * @throws {Error} Listener argument is not a function or a valid method name
	 */
	OO.EventEmitter.prototype.off = function ( event, method, context ) {
		if ( arguments.length === 1 ) {
			// Remove all bindings for event
			delete this.bindings[ event ];
			return this;
		}

		validateMethod( method, context );

		if ( !hasOwn.call( this.bindings, event ) || !this.bindings[ event ].length ) {
			// No matching bindings
			return this;
		}

		// Default to null context
		if ( arguments.length < 3 ) {
			context = null;
		}

		// Remove matching handlers
		const bindings = this.bindings[ event ];
		let i = bindings.length;
		while ( i-- ) {
			if ( bindings[ i ].method === method && bindings[ i ].context === context ) {
				bindings.splice( i, 1 );
			}
		}

		// Cleanup if now empty
		if ( bindings.length === 0 ) {
			delete this.bindings[ event ];
		}
		return this;
	};

	/**
	 * Emit an event.
	 *
	 * All listeners for the event will be called synchronously, in an
	 * unspecified order. If any listeners throw an exception, this won't
	 * disrupt the calls to the remaining listeners; however, the exception
	 * won't be thrown until the next tick.
	 *
	 * Listeners should avoid mutating the emitting object, as this is
	 * something of an anti-pattern which can easily result in
	 * hard-to-understand code with hidden side-effects and dependencies.
	 *
	 * @param {string} event Type of event
	 * @param {...any} [args] Arguments passed to the event handler
	 * @return {boolean} Whether the event was handled by at least one listener
	 */
	OO.EventEmitter.prototype.emit = function ( event, ...args ) {
		if ( !hasOwn.call( this.bindings, event ) ) {
			return false;
		}

		// Slicing ensures that we don't get tripped up by event
		// handlers that add/remove bindings
		const bindings = this.bindings[ event ].slice();
		for ( let i = 0; i < bindings.length; i++ ) {
			const binding = bindings[ i ];
			let method;
			if ( typeof binding.method === 'string' ) {
				// Lookup method by name (late binding)
				method = binding.context[ binding.method ];
			} else {
				method = binding.method;
			}
			if ( binding.once ) {
				// Unbind before calling, to avoid any nested triggers.
				this.off( event, method );
			}
			try {
				method.apply(
					binding.context,
					binding.args ? binding.args.concat( args ) : args
				);
			} catch ( e ) {
				// If one listener has an unhandled error, don't have it
				// take down the emitter. But rethrow asynchronously so
				// debuggers can break with a full async stack trace.
				setTimeout( ( function ( error ) {
					throw error;
				} ).bind( null, e ) );
			}

		}
		return true;
	};

	/**
	 * Emit an event, propagating the first exception some listener throws
	 *
	 * All listeners for the event will be called synchronously, in an
	 * unspecified order. If any listener throws an exception, this won't
	 * disrupt the calls to the remaining listeners. The first exception
	 * thrown will be propagated back to the caller; any others won't be
	 * thrown until the next tick.
	 *
	 * Listeners should avoid mutating the emitting object, as this is
	 * something of an anti-pattern which can easily result in
	 * hard-to-understand code with hidden side-effects and dependencies.
	 *
	 * @param {string} event Type of event
	 * @param {...any} [args] Arguments passed to the event handler
	 * @return {boolean} Whether the event was handled by at least one listener
	 */
	OO.EventEmitter.prototype.emitThrow = function ( event, ...args ) {
		// We tolerate code duplication with #emit, because the
		// alternative is an extra level of indirection which will
		// appear in very many stack traces.
		if ( !hasOwn.call( this.bindings, event ) ) {
			return false;
		}

		let firstError;
		// Slicing ensures that we don't get tripped up by event
		// handlers that add/remove bindings
		const bindings = this.bindings[ event ].slice();
		for ( let i = 0; i < bindings.length; i++ ) {
			const binding = bindings[ i ];
			let method;
			if ( typeof binding.method === 'string' ) {
				// Lookup method by name (late binding)
				method = binding.context[ binding.method ];
			} else {
				method = binding.method;
			}
			if ( binding.once ) {
				// Unbind before calling, to avoid any nested triggers.
				this.off( event, method );
			}
			try {
				method.apply(
					binding.context,
					binding.args ? binding.args.concat( args ) : args
				);
			} catch ( e ) {
				if ( firstError === undefined ) {
					firstError = e;
				} else {
					// If one listener has an unhandled error, don't have it
					// take down the emitter. But rethrow asynchronously so
					// debuggers can break with a full async stack trace.
					setTimeout( ( function ( error ) {
						throw error;
					} ).bind( null, e ) );
				}
			}

		}
		if ( firstError !== undefined ) {
			throw firstError;
		}
		return true;
	};

	/**
	 * Connect event handlers to an object.
	 *
	 * @param {Object} context Object to call methods on when events occur
	 * @param {Object.<string,string>|Object.<string,Function>|Object.<string,Array>} methods
	 *  List of event bindings keyed by event name containing either method names, functions or
	 *  arrays containing method name or function followed by a list of arguments to be passed to
	 *  callback before emitted arguments.
	 * @return {OO.EventEmitter}
	 */
	OO.EventEmitter.prototype.connect = function ( context, methods ) {
		for ( const event in methods ) {
			let method = methods[ event ];
			let args;
			// Allow providing additional args
			if ( Array.isArray( method ) ) {
				args = method.slice( 1 );
				method = method[ 0 ];
			} else {
				args = [];
			}
			// Add binding
			this.on( event, method, args, context );
		}
		return this;
	};

	/**
	 * Disconnect event handlers from an object.
	 *
	 * @param {Object} context Object to disconnect methods from
	 * @param {Object.<string,string>|Object.<string,Function>|Object.<string,Array>} [methods]
	 *  List of event bindings keyed by event name. Values can be either method names, functions or
	 *  arrays containing a method name.
	 *  NOTE: To allow matching call sites with connect(), array values are allowed to contain the
	 *  parameters as well, but only the method name is used to find bindings. It is discouraged to
	 *  have multiple bindings for the same event to the same listener, but if used (and only the
	 *  parameters vary), disconnecting one variation of (event name, event listener, parameters)
	 *  will disconnect other variations as well.
	 * @return {OO.EventEmitter}
	 */
	OO.EventEmitter.prototype.disconnect = function ( context, methods ) {
		let event;
		if ( methods ) {
			// Remove specific connections to the context
			for ( event in methods ) {
				let method = methods[ event ];
				if ( Array.isArray( method ) ) {
					method = method[ 0 ];
				}
				this.off( event, method, context );
			}
		} else {
			// Remove all connections to the context
			for ( event in this.bindings ) {
				const bindings = this.bindings[ event ];
				let i = bindings.length;
				while ( i-- ) {
					// bindings[i] may have been removed by the previous step's
					// this.off so check it still exists
					if ( bindings[ i ] && bindings[ i ].context === context ) {
						this.off( event, bindings[ i ].method, context );
					}
				}
			}
		}

		return this;
	};

}() );
