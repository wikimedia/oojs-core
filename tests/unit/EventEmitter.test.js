( function ( oo, global ) {

	// In NodeJS the `this` as passed from the global scope to this closure is
	// (for NodeJS legacy reasons) not the global object but in fact a reference
	// to module.exports. The `this` inside this closure, however, is the
	// global object.
	global = global.window ? global : this;

	QUnit.module( 'EventEmitter' );

	QUnit.test( 'on', 8, function ( assert ) {
		var callback, x, seq,
			ee = new oo.EventEmitter();

		assert.throws( function () {
			ee.on( 'nocallback' );
		}, 'Throw when callback is missing' );

		assert.throws( function () {
			ee.on( 'invalidcallback', {} );
		}, 'Throw when callback is invalid' );

		ee.on( 'callback', function () {
			assert.ok( true, 'Callback ran' );
		} );
		ee.emit( 'callback' );

		seq = [];
		callback = function ( data ) {
			seq.push( data );
		};

		ee.on( 'multiple', callback );
		ee.on( 'multiple', callback );
		ee.emit( 'multiple', 'x' );

		assert.deepEqual(
			seq,
			[ 'x', 'x' ],
			'Callbacks can be bound multiple times'
		);

		x = {};
		ee.on( 'args', function ( a ) {
			assert.strictEqual( a, x, 'Arguments registered in binding passed to callback' );
		}, [ x ] );
		ee.emit( 'args' );

		ee.on( 'context-default', function () {
			assert.strictEqual( this, global, 'Default context for handlers in non-strict mode is global' );
		} );
		ee.emit( 'context-default' );

		ee.on( 'hasOwnProperty', function () {
			assert.ok( true, 'Bind event with name "hasOwnProperty"' );
		} );
		ee.emit( 'hasOwnProperty' );

		ee.on( 'post', function () {
			// Binding "hasOwnProperty" worked because the first time 'this.bindings.hasOwnProperty'
			// is what it should be (inherited from Object.prototype). But it used to break any events
			// bound after since EventEmitter#on used 'this.bindings.hasOwnProperty'.
			assert.ok( true, 'Bind event after "hasOwnProperty" event exists' );
		} );
		ee.emit( 'post' );
	} );

	QUnit.test( 'once', 1, function ( assert ) {
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

	QUnit.test( 'emit', 4, function ( assert ) {
		var data1, data2A, data2B, data2C,
			ee = new oo.EventEmitter();

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

	QUnit.test( 'off', 3, function ( assert ) {
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
		assert.ok( true, 'Unbinding an unknown event does not fail' );
	} );

	QUnit.test( 'connect', 3, function ( assert ) {
		var data1, host,
			ee = new oo.EventEmitter();

		data1 = {};

		host = {
			onFoo: function () {
				assert.strictEqual( this, host, 'Callback context is connect host' );
			},
			barbara: function ( a ) {
				assert.strictEqual( a, data1, 'Connect takes variadic list of arguments to be passed' );
			}
		};

		ee.connect( host, {
			foo: 'onFoo',
			bar: [ 'barbara', data1 ],
			quux: function () {
				assert.ok( true, 'Callback ran' );
			}
		} );

		ee.emit( 'foo' );
		ee.emit( 'bar' );
		ee.emit( 'quux' );
	} );

	QUnit.test( 'disconnect( host )', 1, function ( assert ) {
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

	QUnit.test( 'disconnect( host, methods )', 1, function ( assert ) {
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

	QUnit.test( 'disconnect( host, unbound methods )', 1, function ( assert ) {
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

	QUnit.test( 'chainable', 6, function ( assert ) {
		var fn = function () {},
			ee = new oo.EventEmitter();

		assert.strictEqual( ee.on( 'basic', fn ), ee, 'on() is chainable' );
		assert.strictEqual( ee.once( 'basic', fn ), ee, 'once() is chainable' );
		assert.strictEqual( ee.emit( 'basic' ), true, 'emit() is NOT chainable' );
		assert.strictEqual( ee.off( 'basic' ), ee, 'off() is chainable' );
		assert.strictEqual( ee.connect( {}, {} ), ee, 'connect() is chainable' );
		assert.strictEqual( ee.disconnect( {} ), ee, 'disconnect() is chainable' );
	} );

}( OO, this ) );
