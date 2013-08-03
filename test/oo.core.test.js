/*!
 * Base object test suite.
 *
 * @package OOJS
 */

( function ( oo, global ) {

QUnit.module( 'OO' );

QUnit.test( 'isPlainObject', 17, function ( assert ) {
	function Thing() {}

	// Plain objects
	assert.strictEqual( oo.isPlainObject( {} ), true, 'empty plain object' );
	assert.strictEqual( oo.isPlainObject( { a: 1 } ), true, 'non-empty plain object' );
	assert.strictEqual( oo.isPlainObject( Object.create( null ) ), true, 'Objects with no prototype from Object.create( null )' );

	// Primitives
	assert.strictEqual( oo.isPlainObject( undefined ), false, 'undefined' );
	assert.strictEqual( oo.isPlainObject( null ), false, 'null' );
	assert.strictEqual( oo.isPlainObject( false ), false,  'boolean false' );
	assert.strictEqual( oo.isPlainObject( true ), false,  'boolean true' );
	assert.strictEqual( oo.isPlainObject( 0 ), false, 'number 0' );
	assert.strictEqual( oo.isPlainObject( 42 ), false, 'positive number' );
	assert.strictEqual( oo.isPlainObject( -42 ), false, 'negative number' );
	assert.strictEqual( oo.isPlainObject( '' ), false, 'empty string' );
	assert.strictEqual( oo.isPlainObject( 'a' ), false, 'non-empty string' );

	// Objects that inherit from Object but are not plain objects
	assert.strictEqual( oo.isPlainObject( [] ), false, 'instance of Array' );
	assert.strictEqual( oo.isPlainObject( new Date() ), false, 'instance of Date' );
	assert.strictEqual( oo.isPlainObject( Thing ), false, 'instance of Function' );
	assert.strictEqual( oo.isPlainObject( new Thing() ), false, 'Instance of constructor function with empty prototype' );

	// Add method to the prototype
	Thing.prototype.time = function () {};

	assert.strictEqual( oo.isPlainObject( new Thing() ), false, 'Instance of constructor function with prototype' );
});

if ( global.document ) {
	QUnit.test( 'isPlainObject - browser specific', 6, function ( assert ) {
		var iframe, IframeObject, threw;

		assert.strictEqual(
			oo.isPlainObject( global.document.createElement( 'div' ) ),
			false,
			'instance of HTMLElement'
		);

		assert.strictEqual(
			oo.isPlainObject( global.document ),
			false,
			'instance of Document'
		);

		assert.strictEqual(
			oo.isPlainObject( global ),
			false,
			'instance of Window'
		);

		iframe = global.document.createElement( 'iframe' );
		global.document.getElementById( 'qunit-fixture' ).appendChild( iframe );
		IframeObject = iframe.contentWindow.Object;


		assert.notStrictEqual(
			IframeObject,
			Object,
			'Object constructor from other window is different'
		);

		assert.strictEqual(
			oo.isPlainObject( new IframeObject() ),
			true,
			'instance of iframeObject'
		);


		// https://bugzilla.mozilla.org/814622
		threw = false;
		try {
			oo.isPlainObject( global.location );
		} catch ( e ) {
			threw = true;
		}
		assert.strictEqual( threw, false, 'native host object' );
	} );
}

QUnit.test( 'inheritClass', 19, function ( assert ) {
	var foo, bar, key, enumKeys;

	function Foo() {
		this.constructedFoo = true;
	}

	Foo.a = 'prop of Foo';
	Foo.b = 'prop of Foo';
	Foo.prototype.b = 'proto of Foo';
	Foo.prototype.c = 'proto of Foo';
	Foo.prototype.bFn = function () {
		return 'proto of Foo';
	};
	Foo.prototype.cFn = function () {
		return 'proto of Foo';
	};

	foo = new Foo();

	function Bar() {
		this.constructedBar = true;
	}
	oo.inheritClass( Bar, Foo );

	assert.deepEqual(
		Foo.static,
		{},
		'A "static" property (empty object) is automatically created if absent'
	);

	Foo.static.a = 'static of Foo';
	Foo.static.b = 'static of Foo';

	assert.notStrictEqual( Foo.static, Bar.static, 'Static property is not copied, but inheriting' );
	assert.equal( Bar.static.a, 'static of Foo', 'Foo.static inherits from Bar.static' );

	Bar.static.b = 'static of Bar';

	assert.equal( Foo.static.b, 'static of Foo', 'Change to Bar.static does not affect Foo.static' );

	Bar.a = 'prop of Bar';
	Bar.prototype.b = 'proto of Bar';
	Bar.prototype.bFn = function () {
		return 'proto of Bar';
	};

	assert.throws( function () {
		oo.inheritClass( Bar, Foo );
	}, 'Throw if target already inherits from source (from an earlier call)' );

	assert.throws( function () {
		oo.inheritClass( Bar, Object );
	}, 'Throw if target already inherits from source (naturally, Object)' );

	bar = new Bar();

	assert.strictEqual(
		Bar.b,
		undefined,
		'Constructor properties are not inherited'
	);

	assert.strictEqual(
		foo instanceof Foo,
		true,
		'foo instance of Foo'
	);
	assert.strictEqual(
		foo instanceof Bar,
		false,
		'foo not instance of Bar'
	);

	assert.strictEqual(
		bar instanceof Foo,
		true,
		'bar instance of Foo'
	);
	assert.strictEqual(
		bar instanceof Bar,
		true,
		'bar instance of Bar'
	);

	assert.equal( bar.constructor, Bar, 'constructor property is restored' );
	assert.equal( bar.b, 'proto of Bar', 'own methods go first' );
	assert.equal( bar.bFn(), 'proto of Bar', 'own properties go first' );
	assert.equal( bar.c, 'proto of Foo', 'prototype properties are inherited' );
	assert.equal( bar.cFn(), 'proto of Foo', 'prototype methods are inherited' );

	enumKeys = [];
	for ( key in bar ) {
		enumKeys.push( key );
	}

	// issue #8
	assert.strictEqual(
		enumKeys.indexOf( 'constructor' ),
		-1,
		'The restored "constructor" property should not be enumerable'
	);

	Bar.prototype.dFn = function () {
		return 'proto of Bar';
	};
	Foo.prototype.dFn = function () {
		return 'proto of Foo';
	};
	Foo.prototype.eFn = function () {
		return 'proto of Foo';
	};

	assert.equal( bar.dFn(), 'proto of Bar', 'inheritance is live (overwriting an inherited method)' );
	assert.equal( bar.eFn(), 'proto of Foo', 'inheritance is live (adding a new method deeper in the chain)' );
} );

QUnit.test( 'mixinClass', 4, function ( assert ) {
	var quux;

	function Foo() {}
	Foo.prototype.aFn = function () {
		return 'proto of Foo';
	};

	function Bar() {}
	// oo.inheritClass makes the 'constructor'
	// property an own property when it restores it.
	oo.inheritClass( Bar, Foo );
	Bar.prototype.bFn = function () {
		return 'mixin of Bar';
	};

	function Quux() {}
	oo.mixinClass( Quux, Bar );

	assert.strictEqual(
		Quux.prototype.aFn,
		undefined,
		'mixin inheritance is not copied over'
	);

	assert.strictEqual(
		Quux.prototype.constructor,
		Quux,
		'constructor property skipped'
	);

	assert.strictEqual(
		Quux.prototype.hasOwnProperty( 'bFn' ),
		true,
		'mixin properties are now own properties, not inherited'
	);

	quux = new Quux();

	assert.equal( quux.bFn(), 'mixin of Bar', 'mixin method works as expected' );
} );

QUnit.test( 'cloneObject', 4, function ( assert ) {
	var myfoo, myfooClone, expected;

	function Foo( x ) {
		this.x = x;
	}
	Foo.prototype.x = 'default';
	Foo.prototype.aFn = function () {
		return 'proto of Foo';
	};

	myfoo = new Foo( 10 );
	myfooClone = oo.cloneObject( myfoo );

	assert.notStrictEqual( myfoo, myfooClone, 'clone is not equal when compared by reference' );
	assert.deepEqual( myfoo, myfooClone, 'clone is equal when recursively compared by value' );

	expected = {
		x: 10,
		aFn: 'proto of Foo',
		constructor: Foo,
		instanceOf: true,
		own: {
			x: true,
			aFn: false,
			constructor: false
		}
	};

	assert.deepEqual(
		{
			x: myfoo.x,
			aFn: myfoo.aFn(),
			constructor: myfoo.constructor,
			instanceOf: myfoo instanceof Foo,
			own: {
				x: myfoo.hasOwnProperty( 'x' ),
				aFn: myfoo.hasOwnProperty( 'aFn' ),
				constructor: myfoo.hasOwnProperty( 'constructor' )
			}
		},
		expected,
		'original looks as expected'
	);

	assert.deepEqual(
		{
			x: myfooClone.x,
			aFn: myfooClone.aFn(),
			constructor: myfooClone.constructor,
			instanceOf: myfooClone instanceof Foo,
			own: {
				x: myfooClone.hasOwnProperty( 'x' ),
				aFn: myfooClone.hasOwnProperty( 'aFn' ),
				constructor: myfoo.hasOwnProperty( 'constructor' )
			}
		},
		expected,
		'clone looks as expected'
	);

} );

QUnit.test( 'getObjectValues', 6, function ( assert ) {
	var tmp;

	assert.deepEqual(
		oo.getObjectValues( { a: 1, b: 2, c: 3, foo: 'bar' } ),
		[ 1, 2, 3, 'bar' ],
		'Simple object with numbers and strings as values'
	);
	assert.deepEqual(
		oo.getObjectValues( [ 1, 2, 3, 'bar' ] ),
		[ 1, 2, 3, 'bar' ],
		'Simple array with numbers and strings as values'
	);

	tmp = function () {
		this.isTest = true;

		return this;
	};
	tmp.a = 'foo';
	tmp.b = 'bar';

	assert.deepEqual(
		oo.getObjectValues( tmp ),
		['foo', 'bar'],
		'Function with properties'
	);

	assert.throws(
		function () {
			oo.getObjectValues( 'hello' );
		},
		TypeError,
		'Throw exception for non-object (string)'
	);

	assert.throws(
		function () {
			oo.getObjectValues( 123 );
		},
		TypeError,
		'Throw exception for non-object (number)'
	);

	assert.throws(
		function () {
			oo.getObjectValues( null );
		},
		TypeError,
		'Throw exception for non-object (null)'
	);
} );

QUnit.test( 'compare( Object, Object )', 12, function ( assert ) {
	var x, y, z;

	assert.strictEqual(
		oo.compare( [], [] ),
		true,
		'Empty array'
	);

	assert.strictEqual(
		oo.compare( {}, {} ),
		true,
		'Empty plain object'
	);

	assert.strictEqual(
		oo.compare( [ undefined ], [ undefined ] ),
		true,
		'Undefined'
	);

	assert.strictEqual(
		oo.compare( [ null ], [ null ] ),
		true,
		'Null'
	);

	assert.strictEqual(
		oo.compare( [ true ], [ true ] ),
		true,
		'boolean'
	);

	assert.strictEqual(
		oo.compare( [ 42 ], [ 42 ] ),
		true,
		'number'
	);

	assert.strictEqual(
		oo.compare( [ 'foo' ], [ 'foo' ] ),
		true,
		'string'
	);

	assert.strictEqual(
		oo.compare( [], {} ),
		true,
		'Empty array equals empty plain object'
	);

	assert.strictEqual(
		oo.compare(
			{
				foo: [ true, 42 ],
				bar: [ {
					x: {},
					y: [ 'test' ]
				} ]
			},
			{
				foo: [ true, 42 ],
				bar: [ {
					x: {},
					y: [ 'test' ]
				} ]
			}
		),
		true,
		'Nested structure with no difference'
	);

	assert.strictEqual(
		oo.compare(
			{
				foo: [ true, 42 ],
				bar: [ {
					x: {},
					y: [ 'test' ]
				} ]
			},
			{
				foo: [ 1, 42 ],
				bar: [ {
					x: {},
					y: [ 'test' ]
				} ]
			}
		),
		false,
		'Nested structure with difference'
	);

	x = function X() {
		this.name = 'X';
	};
	x.foo = [ true ];

	y = function Y() {
		this.name = 'Y';
	};
	y.foo = [ true ];

	z = function Z() {
		this.name = 'Z';
	};
	z.foo = [ 1 ];

	// oo.compare ignores the function body. It treats them
	// like regular object containers.
	assert.strictEqual(
		oo.compare( x, y ),
		true,
		'Function object with no difference'
	);

	assert.strictEqual(
		oo.compare( x, z ),
		false,
		'Function object with difference'
	);
} );

QUnit.test( 'compare( Object, Object, Boolean asymmetrical )', 3, function ( assert ) {
	var x, y, z;

	x = {
		foo: [ true, 42 ]
	};
	y = {
		foo: [ true, 42, 10 ],
		bar: [ {
			x: {},
			y: [ 'test' ]
		} ]
	};
	z = {
		foo: [ 1, 42 ],
		bar: [ {
			x: {},
			y: [ 'test' ]
		} ]
	};

	assert.strictEqual(
		oo.compare( x, y, false ),
		false,
		'A subset of B (asymmetrical: false)'
	);

	assert.strictEqual(
		oo.compare( x, y, true ),
		true,
		'A subset of B (asymmetrical: true)'
	);

	assert.strictEqual(
		oo.compare( x, z, true ),
		false,
		'A subset of B with differences (asymmetrical: true)'
	);
} );

QUnit.test( 'copy( Array )', 8, function ( assert ) {
	var simpleArray = [ 'foo', 3, true, false ],
		withObj = [ { 'bar': 'baz', 'quux': 3 }, 5, null ],
		nestedArray = [ [ 'a', 'b' ], [ 1, 3, 4 ] ],
		sparseArray = [ 'a', undefined, undefined, 'b' ],
		withSparseArray = [ [ 'a', undefined, undefined, 'b' ] ],
		withFunction = [ function () { return true; } ];

	function Cloneable( p ) {
		this.p = p;
	}

	function Thing( p ) {
		this.p = p;

		// Create a trap here to make sure we explode if
		// oo.copy tries to copy non-plain objects.
		this.child = {
			parrent: this
		};
	}

	Cloneable.prototype.clone = function () {
		return new Cloneable( this.p + '-clone' );
	};

	assert.deepEqual(
		oo.copy( simpleArray ),
		simpleArray,
		'Simple array'
	);
	assert.deepEqual(
		oo.copy( withObj ),
		withObj,
		'Array containing object'
	);
	assert.deepEqual(
		oo.copy( [ new Cloneable( 'bar' ) ] ),
		[ new Cloneable( 'bar-clone' ) ],
		'Use the .clone() method if available'
	);
	assert.deepEqual(
		oo.copy( nestedArray ),
		nestedArray,
		'Nested array'
	);
	assert.deepEqual(
		oo.copy( sparseArray ),
		sparseArray,
		'Sparse array'
	);
	assert.deepEqual(
		oo.copy( withSparseArray ),
		withSparseArray,
		'Nested sparse array'
	);
	assert.deepEqual(
		oo.copy( withFunction ),
		withFunction,
		'Array containing function'
	);

	assert.deepEqual(
		oo.copy( [ new Thing( 42 ) ] ),
		[ new Thing( 42 ) ]
	);
} );

QUnit.test( 'copy( Object )', 7, function ( assert ) {
	var simpleObj = { 'foo': 'bar', 'baz': 3, 'quux': null, 'truth': true, 'falsehood': false },
		nestedObj = { 'foo': { 'bar': 'baz', 'quux': 3 }, 'whee': 5 },
		withArray = { 'foo': [ 'a', 'b' ], 'bar': [ 1, 3, 4 ] },
		withSparseArray = { 'foo': [ 'a', undefined, undefined, 'b' ] },
		withFunction = { 'func': function () { return true; } },
		Cloneable = function ( p ) {
			this.p = p;
		};
	Cloneable.prototype.clone = function () { return new Cloneable( this.p + '-clone' ); };

	assert.deepEqual(
		oo.copy( simpleObj ),
		simpleObj,
		'Simple object'
	);
	assert.deepEqual(
		oo.copy( nestedObj ),
		nestedObj,
		'Nested object'
	);
	assert.deepEqual(
		oo.copy( new Cloneable( 'foo' ) ),
		new Cloneable( 'foo-clone' ),
		'Cloneable object'
	);
	assert.deepEqual(
		oo.copy( { 'foo': new Cloneable( 'bar' ) } ),
		{ 'foo': new Cloneable( 'bar-clone' ) },
		'Object containing object'
	);
	assert.deepEqual(
		oo.copy( withArray ),
		withArray,
		'Object with array'
	);
	assert.deepEqual(
		oo.copy( withSparseArray ),
		withSparseArray,
		'Object with sparse array'
	);
	assert.deepEqual(
		oo.copy( withFunction ),
		withFunction,
		'Object with function'
	);
} );

}( OO, this ) );
