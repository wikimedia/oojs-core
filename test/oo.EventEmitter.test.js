/*!
 * EventEmitter test suite.
 */

( function ( oo, global ) {

// In NodeJS the `this` as passed from the global scope to this closure is
// (for NodeJS legacy reasons) not the global object but in fact a reference
// to module.exports. The `this` inside this closure, however, is the
// global object.
global = global.window ? global : this;

QUnit.module( 'OO.EventEmitter' );

QUnit.test( 'on', 7, function ( assert ) {
	var fnMultiple, x,
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

	fnMultiple = function () {
		assert.ok( true, 'Callbacks can be bound multiple times' );
	};

	ee.on( 'multiple', fnMultiple );
	ee.on( 'multiple', fnMultiple );
	ee.emit( 'multiple' );

	x = {};
	ee.on( 'args', function ( a ) {
		assert.strictEqual( a, x, 'Arguments registered in binding passed to callback' );
	}, [ x ] );
	ee.emit( 'args' );

	ee.on( 'context-default', function () {
		assert.strictEqual( this, global, 'Default context for handlers in non-strict mode is global' );
	} );
	/*
		Doesn't work because PhantomJS uses an outdated jsc engine that doesn't
		support everything from ES5 yet, Strict Mode is among the lacking features.
	 ( function () {
		'use strict';
		assert.strictEqual( this, undefined, 'closure this in strict mode is undefined' );
	} () );
	*/
	ee.emit( 'context-default' );
} );

QUnit.test( 'once', 1, function ( assert ) {
	var i = 0,
		ee = new oo.EventEmitter();

	ee.once( 'basic', function () {
		i++;
		assert.equal( i, 1, 'Callback ran only once' );
	} );

	ee.emit( 'basic' );
	ee.emit( 'basic' );
	ee.emit( 'basic' );
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

QUnit.test( 'off', 4, function ( assert ) {
	var i, fn,
		ee = new oo.EventEmitter();

	ee.on( 'basic', function () {
		i++;
		assert.ok( i === 1 || i === 2, 'Callback unbound when unbinding the event name' );
	} );

	i = 0;
	ee.emit( 'basic' );
	ee.emit( 'basic' );
	ee.off( 'basic' );
	ee.emit( 'basic' );
	ee.emit( 'basic' );

	fn = function () {
		i++;
		assert.ok( i === 11 || i === 12, 'Callback unbound when unbinding by function reference' );
	};

	i = 10;
	ee.on( 'fn', fn );
	ee.emit( 'fn' );
	ee.emit( 'fn' );
	ee.off( 'fn', fn );
	ee.emit( 'fn' );
	ee.emit( 'fn' );
} );

QUnit.test( 'connect', 2, function ( assert ) {
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
		bar: [ 'barbara', data1 ]
	} );

	ee.emit( 'foo' );
	ee.emit( 'bar' );
} );

QUnit.test( 'disconnect( host )', 2, function ( assert ) {
	var host, i,
		ee = new oo.EventEmitter();

	host = {
		onFoo: function () {
			i++;
			assert.strictEqual( i, 1, 'onFoo is unbound by disconnect' );
		},
		onBar: function () {
			i++;
			assert.strictEqual( i, 2, 'onBar is unbound by disconnect' );
		}
	};

	i = 0;
	ee.connect( host, {
		foo: 'onFoo',
		bar: 'onBar'
	} );
	ee.emit( 'foo' );
	ee.emit( 'bar' );

	ee.disconnect( host );
	ee.emit( 'foo' );
	ee.emit( 'bar' );
} );

QUnit.test( 'disconnect( host, methods )', 3, function ( assert ) {
	var host, i,
		ee = new oo.EventEmitter();

	host = {
		onFoo: function () {
			i++;
			assert.strictEqual( i, 1, 'onFoo is unbound by disconnect' );
		},
		onBar: function () {
			i++;
			assert.ok( i === 2 || i === 3, 'onBar is unbound by disconnect' );
		}
	};

	i = 0;
	ee.connect( host, {
		foo: 'onFoo',
		bar: 'onBar'
	} );
	ee.emit( 'foo' );
	ee.emit( 'bar' );

	ee.disconnect( host, { foo: 'onFoo' } );
	ee.emit( 'foo' );
	ee.emit( 'bar' );
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
