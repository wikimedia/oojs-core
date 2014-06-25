/*global hasOwn */

/**
 * @class OO.EventEmitter
 *
 * @constructor
 */
oo.EventEmitter = function OoEventEmitter() {
	// Properties

	/**
	 * Storage of bound event handlers by event name.
	 *
	 * @property
	 */
	this.bindings = {};
};

/* Methods */

/**
 * Add a listener to events of a specific event.
 *
 * @param {string} event Type of event to listen to
 * @param {Function} callback Function to call when event occurs
 * @param {Array} [args] Arguments to pass to listener, will be prepended to emitted arguments
 * @param {Object} [context=null] Object to use as context for callback function or call method on
 * @throws {Error} Listener argument is not a function or method name
 * @chainable
 */
oo.EventEmitter.prototype.on = function ( event, callback, args, context ) {
	var bindings;

	// Validate callback
	if ( typeof callback !== 'function' ) {
		throw new Error( 'Invalid callback. Function or method name expected.' );
	}
	// Fallback to null context
	if ( arguments.length < 4 ) {
		context = null;
	}
	if ( hasOwn.call( this.bindings, event ) ) {
		bindings = this.bindings[event];
	} else {
		// Auto-initialize bindings list
		bindings = this.bindings[event] = [];
	}
	// Add binding
	bindings.push( {
		callback: callback,
		args: args,
		context: context
	} );
	return this;
};

/**
 * Adds a one-time listener to a specific event.
 *
 * @param {string} event Type of event to listen to
 * @param {Function} listener Listener to call when event occurs
 * @chainable
 */
oo.EventEmitter.prototype.once = function ( event, listener ) {
	var eventEmitter = this,
		listenerWrapper = function () {
			eventEmitter.off( event, listenerWrapper );
			listener.apply( eventEmitter, Array.prototype.slice.call( arguments, 0 ) );
		};
	return this.on( event, listenerWrapper );
};

/**
 * Remove a specific listener from a specific event.
 *
 * @param {string} event Type of event to remove listener from
 * @param {Function} [callback] Listener to remove, omit to remove all
 * @param {Object} [context=null] Object used context for callback function or method
 * @chainable
 * @throws {Error} Listener argument is not a function
 */
oo.EventEmitter.prototype.off = function ( event, callback, context ) {
	var i, bindings;

	if ( arguments.length === 1 ) {
		// Remove all bindings for event
		delete this.bindings[event];
	} else {
		if ( typeof callback !== 'function' ) {
			throw new Error( 'Invalid callback. Function expected.' );
		}
		if ( !( event in this.bindings ) || !this.bindings[event].length ) {
			// No matching bindings
			return this;
		}
		// Fallback to null context
		if ( arguments.length < 3 ) {
			context = null;
		}
		// Remove matching handlers
		bindings = this.bindings[event];
		i = bindings.length;
		while ( i-- ) {
			if ( bindings[i].callback === callback && bindings[i].context === context ) {
				bindings.splice( i, 1 );
			}
		}
		// Cleanup if now empty
		if ( bindings.length === 0 ) {
			delete this.bindings[event];
		}
	}
	return this;
};

/**
 * Emit an event.
 *
 * TODO: Should this be chainable? What is the usefulness of the boolean
 * return value here?
 *
 * @param {string} event Type of event
 * @param {Mixed} args First in a list of variadic arguments passed to event handler (optional)
 * @return {boolean} If event was handled by at least one listener
 */
oo.EventEmitter.prototype.emit = function ( event ) {
	var i, len, binding, bindings, args;

	if ( event in this.bindings ) {
		// Slicing ensures that we don't get tripped up by event handlers that add/remove bindings
		bindings = this.bindings[event].slice();
		args = Array.prototype.slice.call( arguments, 1 );
		for ( i = 0, len = bindings.length; i < len; i++ ) {
			binding = bindings[i];
			binding.callback.apply(
				binding.context,
				binding.args ? binding.args.concat( args ) : args
			);
		}
		return true;
	}
	return false;
};

/**
 * Connect event handlers to an object.
 *
 * @param {Object} context Object to call methods on when events occur
 * @param {Object.<string,string>|Object.<string,Function>|Object.<string,Array>} methods List of
 *  event bindings keyed by event name containing either method names, functions or arrays containing
 *  method name or function followed by a list of arguments to be passed to callback before emitted
 *  arguments
 * @chainable
 */
oo.EventEmitter.prototype.connect = function ( context, methods ) {
	var method, callback, args, event;

	for ( event in methods ) {
		method = methods[event];
		// Allow providing additional args
		if ( Array.isArray( method ) ) {
			args = method.slice( 1 );
			method = method[0];
		} else {
			args = [];
		}
		// Allow callback to be a method name
		if ( typeof method === 'string' ) {
			// Validate method
			if ( !context[method] || typeof context[method] !== 'function' ) {
				throw new Error( 'Method not found: ' + method );
			}
			// Resolve to function
			callback = context[method];
		} else {
			callback = method;
		}
		// Add binding
		this.on.apply( this, [ event, callback, args, context ] );
	}
	return this;
};

/**
 * Disconnect event handlers from an object.
 *
 * @param {Object} context Object to disconnect methods from
 * @param {Object.<string,string>|Object.<string,Function>|Object.<string,Array>} [methods] List of
 * event bindings keyed by event name containing either method names or functions
 * @chainable
 */
oo.EventEmitter.prototype.disconnect = function ( context, methods ) {
	var i, method, callback, event, bindings;

	if ( methods ) {
		// Remove specific connections to the context
		for ( event in methods ) {
			method = methods[event];
			if ( typeof method === 'string' ) {
				// Validate method
				if ( !context[method] || typeof context[method] !== 'function' ) {
					throw new Error( 'Method not found: ' + method );
				}
				// Resolve to function
				callback = context[method];
			} else {
				callback = method;
			}
			this.off( event, callback, context );
		}
	} else {
		// Remove all connections to the context
		for ( event in this.bindings ) {
			bindings = this.bindings[event];
			i = bindings.length;
			while ( i-- ) {
				if ( bindings[i].context === context ) {
					this.off( event, bindings[i].callback, context );
				}
			}
		}
	}

	return this;
};
