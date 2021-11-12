( function ( oo, global ) {

	// In NodeJS the `this` as passed from the global scope to this closure is
	// (for NodeJS legacy reasons) not the global object but in fact a reference
	// to module.exports. The `this` inside this closure, however, is the
	// global object.
	global = global.window ? global : this;

	QUnit.module( 'EventEmitter' );

	QUnit.test( 'on', function ( assert ) {
		var callback, x, seq, thrown,
			origSetTimeout = global.setTimeout,
			ee = new oo.EventEmitter();

		assert.throws( function () {
			ee.on( 'nocallback' );
		}, 'Throw when callback is missing' );

		assert.throws( function () {
			ee.on( 'invalidcallback', {} );
		}, 'Throw when callback is invalid' );

		ee.on( 'callback', function () {
			assert.true( true, 'Callback ran' );
		} );
		ee.emit( 'callback' );

		seq = [];
		callback = function ( data ) {
			seq.push( data );
		};

		ee.on( 'multiple', callback );
		ee.on( 'multiple', callback );
		ee.emit( 'multiple', 'x' );
		assert.deepEqual( seq, [ 'x', 'x' ], 'Callbacks can be bound multiple times' );
		seq = [];
		ee.emitThrow( 'multiple', 'x' );
		assert.deepEqual( seq, [ 'x', 'x' ], 'Callbacks can be bound multiple times' );

		// Stub setTimeout for coverage purposes
		global.setTimeout = function ( fn ) {
			try {
				fn();
			} catch ( e ) {
				thrown.push( e );
			}
		};

		try {
			x = 0;
			thrown = [];
			ee.on( 'multiple-error', function () {
				x += 1;
			} );
			ee.on( 'multiple-error', function () {
				throw new Error( 'Unhandled error 1' );
			} );
			ee.on( 'multiple-error', function () {
				x += 10;
			} );
			ee.on( 'multiple-error', function () {
				throw new Error( 'Unhandled error 2' );
			} );
			ee.on( 'multiple-error', function () {
				x += 100;
			} );
			ee.emit( 'multiple-error' );
			assert.strictEqual( thrown.length, 2, 'emit throws errors in callbacks asynchronously' );
			assert.strictEqual( x, 111, 'emit runs every callback even if errors are thrown' );
			x = 0;
			thrown = [];
			assert.throws( function () {
				ee.emitThrow( 'multiple-error' );
			}, /Unhandled error 1/, 'emitThrow propagates the first error' );
			assert.true(
				thrown.length === 1 && /Unhandled error 2/.test( thrown[ 0 ].message ),
				'emitThrow throws subsequent errors asynchronously'
			);
			assert.strictEqual( x, 111, 'emitThrow runs every callback even if errors are thrown' );
		} finally {
			// Restore it
			global.setTimeout = origSetTimeout;
		}

		x = {};
		ee.on( 'args', function ( a ) {
			assert.strictEqual( a, x, 'Arguments registered in binding passed to callback' );
		}, [ x ] );
		ee.emit( 'args' );
		ee.emitThrow( 'args' );

		ee.on( 'context-default', function () {
			assert.strictEqual(
				this,
				global,
				'Default context for handlers in non-strict mode is global'
			);
		} );
		ee.emit( 'context-default' );
		ee.emitThrow( 'context-default' );

		x = {
			methodName: function () {
				seq.push( this );
			}
		};
		seq = [];
		ee.on( 'context-custom', 'methodName', [], x );
		ee.emit( 'context-custom' );
		assert.deepEqual( seq, [ x ], 'Custom context' );
		seq = [];
		ee.emitThrow( 'context-custom' );
		assert.deepEqual( seq, [ x ], 'Custom context' );

		assert.throws( function () {
			ee.on( 'invalid-context', 'methodName', [], null );
		}, 'invalid context' );
		assert.throws( function () {
			ee.on( 'invalid-context', 'methodName', [], undefined );
		}, 'invalid context' );

		assert.deepEqual( ee.emit( 'hasOwnProperty' ), false, 'Event with name "hasOwnProperty" doesn\'t exist by default' );

		ee.on( 'hasOwnProperty', function () {
			assert.true( true, 'Bind event with name "hasOwnProperty"' );
		} );
		ee.emit( 'hasOwnProperty' );

		ee.on( 'post', function () {
			// Binding "hasOwnProperty" worked because the first time 'this.bindings.hasOwnProperty'
			// is what it should be (inherited from Object.prototype). But it used to break any
			// events bound after since EventEmitter#on used 'this.bindings.hasOwnProperty'.
			assert.true( true, 'Bind event after "hasOwnProperty" event exists' );
		} );
		ee.emit( 'post' );
	} );

	QUnit.test( 'once', function ( assert ) {
		var seq,
			ee = new oo.EventEmitter();

		seq = [];
		ee.once( 'basic', function () {
			seq.push( 'call' );
		} );

		ee.emit( 'basic' );
		ee.emit( 'basic' );
		ee.emit( 'basic' );

		assert.deepEqual( seq, [ 'call' ], 'Callback ran only once' );
	} );

	QUnit.test( 'once - nested', function ( assert ) {
		var seq = [],
			ee = new oo.EventEmitter();

		ee.once( 'basic', function ( value ) {
			seq.push( value );
			if ( value === 'one' ) {
				// Verify once is truly once, handler must be unbound
				// before handler runs.
				ee.emit( 'basic', 'nested' );
			}
		} );

		ee.emit( 'basic', 'one' );
		ee.emit( 'basic', 'two' );
		assert.deepEqual( seq, [ 'one' ], 'Callback ran only once' );
	} );

	QUnit.test( 'once - off', function ( assert ) {
		var seq,
			ee = new oo.EventEmitter();

		function handle() {
			seq.push( 'call' );
		}

		seq = [];
		ee.once( 'basic', handle );
		ee.off( 'basic', handle );
		ee.emit( 'basic' );
		ee.emitThrow( 'basic' );
		assert.deepEqual( seq, [], 'Handle is compatible with off()' );

		seq = [];
		ee.once( 'basic', handle );
		ee.emit( 'basic' );
		assert.deepEqual( seq, [ 'call' ], 'Handle can be re-bound' );
		seq = [];
		ee.once( 'basic', handle );
		ee.emitThrow( 'basic' );
	} );

	QUnit.test( 'emit', function ( assert ) {
		var data1, data2A, data2B, data2C,
			ee = new oo.EventEmitter();

		assert.strictEqual( ee.emit( 'return' ), false, 'Return value when no handlers are registered' );
		ee.on( 'return', function () {} );
		assert.strictEqual( ee.emit( 'return' ), true, 'Return value when a handler is registered' );
		ee.off( 'return' );
		assert.strictEqual( ee.emit( 'return' ), false, 'Return value when handlers were removed' );

		ee.on( 'dataParam', function ( data ) {
			assert.strictEqual( data, data1, 'Data is passed on to event handler' );
		} );

		data1 = {};
		ee.emit( 'dataParam', data1 );

		data2A = {};
		data2B = {};
		data2C = {};

		ee.on( 'dataParams', function ( a, b, c ) {
			assert.strictEqual( a, data2A, 'Multiple data parameters (1) are passed on to event handler' );
			assert.strictEqual( b, data2B, 'Multiple data parameters (2) are passed on to event handler' );
			assert.strictEqual( c, data2C, 'Multiple data parameters (3) are passed on to event handler' );
		} );

		ee.emit( 'dataParams', data2A, data2B, data2C );
	} );

	QUnit.test( 'off', function ( assert ) {
		var hits, callback,
			ee = new oo.EventEmitter();

		hits = 0;
		ee.on( 'basic', function () {
			hits++;
		} );

		ee.emit( 'basic' );
		ee.emit( 'basic' );
		ee.off( 'basic' );
		ee.emit( 'basic' );
		ee.emit( 'basic' );

		assert.strictEqual( hits, 2, 'Callback unbound after unbinding with event name' );

		hits = 0;
		callback = function () {
			hits++;
		};

		ee.on( 'fn', callback );
		ee.emit( 'fn' );
		ee.emit( 'fn' );
		ee.off( 'fn', callback );
		ee.emit( 'fn' );
		ee.emit( 'fn' );

		assert.strictEqual( hits, 2, 'Callback unbound after unbinding with function reference' );

		ee.off( 'unknown' );
		assert.true( true, 'Unbinding an unknown event' );

		ee.off( 'unknown', callback );
		assert.true( true, 'Unbinding an unknown callback' );

		ee.off( 'hasOwnProperty', callback );
		assert.true( true, 'Unbinding an unknown callback for event named "hasOwnProperty"' );
	} );

	QUnit.test( 'connect', function ( assert ) {
		var data1, host,
			ee = new oo.EventEmitter();

		data1 = {};

		host = {
			onFoo: function () {
				assert.strictEqual( this, host, 'Callback context is connect host' );
			},
			barbara: function ( a ) {
				assert.strictEqual( a, data1, 'Connect takes variadic list of arguments to be passed' );
			},
			bazoon: [ 'not', 'a', 'function' ]
		};

		ee.connect( host, {
			foo: 'onFoo',
			bar: [ 'barbara', data1 ],
			quux: function () {
				assert.true( true, 'Callback ran' );
			}
		} );

		ee.emit( 'foo' );
		ee.emit( 'bar' );
		ee.emit( 'quux' );

		assert.throws( function () {
			ee.connect( host, {
				baz: 'onBaz'
			} );
		}, 'Connecting to unknown method' );

		assert.throws( function () {
			ee.connect( host, {
				baz: 'bazoon'
			} );
		}, 'Connecting to invalid method' );
	} );

	QUnit.test( 'disconnect( host )', function ( assert ) {
		var host,
			hits = { foo: 0, bar: 0 },
			ee = new oo.EventEmitter();

		host = {
			onFoo: function () {
				hits.foo++;
			},
			onBar: function () {
				hits.bar++;
			}
		};

		ee.connect( host, {
			foo: 'onFoo',
			bar: 'onBar'
		} );
		ee.emit( 'foo' );
		ee.emit( 'bar' );

		ee.disconnect( host );
		ee.emit( 'foo' );
		ee.emit( 'bar' );

		assert.deepEqual( hits, { foo: 1, bar: 1 } );
	} );

	QUnit.test( 'disconnect( host, methods )', function ( assert ) {
		var host,
			hits = { foo: 0, bar: 0 },
			ee = new oo.EventEmitter();

		host = {
			onFoo: function () {
				hits.foo++;
			},
			onBar: function () {
				hits.bar++;
			}
		};

		ee.connect( host, {
			foo: 'onFoo',
			bar: 'onBar'
		} );
		ee.emit( 'foo' );
		ee.emit( 'bar' );

		ee.disconnect( host, { foo: 'onFoo' } );
		ee.emit( 'foo' );
		ee.emit( 'bar' );

		assert.deepEqual( hits, { foo: 1, bar: 2 } );
	} );

	QUnit.test( 'disconnect( host, array methods )', function ( assert ) {
		var host,
			hits = { foo: 0, barbara: 0, barbaraAlt: 0 },
			ee = new oo.EventEmitter();

		host = {
			onFoo: function () {
				hits.foo++;
			},
			barbara: function ( param ) {
				if ( param === 'alt' ) {
					hits.barbaraAlt++;
				} else {
					hits.barbara++;
				}
			}
		};

		ee.connect( host, {
			foo: 'onFoo',
			bar: [ 'barbara', 'regular' ]
		} );
		ee.emit( 'foo' );
		ee.emit( 'bar' );
		assert.deepEqual( hits, { foo: 1, barbara: 1, barbaraAlt: 0 } );

		// disconnect finds "barbara" by method name, parameters not needed
		ee.disconnect( host, { bar: [ 'barbara' ] } );
		ee.emit( 'foo' );
		ee.emit( 'bar' );
		assert.deepEqual( hits, { foo: 2, barbara: 1, barbaraAlt: 0 } );

		ee.connect( host, {
			bar: [ 'barbara', 'regular' ]
		} );
		ee.connect( host, {
			bar: [ 'barbara', 'alt' ]
		} );
		ee.emit( 'bar' );
		// both barbara's increase
		assert.deepEqual( hits, { foo: 2, barbara: 2, barbaraAlt: 1 } );

		// disconnect finds both "barbara" by method name, parameters ignored
		ee.disconnect( host, { bar: [ 'barbara', 'ignored' ] } );
		ee.emit( 'bar' );

		// foo increased, but barabara not (following disconnect of both)
		assert.deepEqual( hits, { foo: 2, barbara: 2, barbaraAlt: 1 } );
	} );

	QUnit.test( 'disconnect( host, unbound methods )', function ( assert ) {
		var host,
			ee = new oo.EventEmitter();

		host = {
			onFoo: function () {
			},
			onBar: function () {
			}
		};

		// Verify that disconnect does not fail if there were no events bound yet
		ee = new oo.EventEmitter();
		ee.disconnect( {} );
		ee.disconnect( host, { foo: 'onFoo' } );
		ee.disconnect( host );

		assert.throws( function () {
			ee.disconnect( host, { notfound: 'onExample' } );
		}, 'method must exist on host object even if event has no listeners' );
	} );

	QUnit.test( 'chainable', function ( assert ) {
		var fn = function () {},
			ee = new oo.EventEmitter();

		assert.strictEqual( ee.on( 'basic', fn ), ee, 'on() is chainable' );
		assert.strictEqual( ee.once( 'basic', fn ), ee, 'once() is chainable' );
		assert.strictEqual( ee.off( 'basic' ), ee, 'off() is chainable' );
		assert.strictEqual( ee.connect( {}, {} ), ee, 'connect() is chainable' );
		assert.strictEqual( ee.disconnect( {} ), ee, 'disconnect() is chainable' );
	} );

}( OO, this ) );
