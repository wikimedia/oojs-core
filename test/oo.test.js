/*!
 * Base object test suite.
 *
 * @package OOJS
 */

( function ( oo ) {

QUnit.module( 'oo' );

/* Tests */

QUnit.test( 'createObject', 4, function ( assert ) {
	var foo, bar, fooKeys, barKeys;

	foo = {
		a: 'a of foo',
		b: 'b of foo'
	};

	bar = oo.createObject( foo );

	// Add an own property, hiding the inherited one.
	bar.b = 'b of bar';

	// Add an own property, hiding an inherited property
	// that will be added later
	bar.c = 'c of bar';

	// Add more properties to the origin object,
	// should be visible in the inheriting object.
	foo.c = 'c of foo';
	foo.d = 'd of foo';

	// Different property that only one of each has
	foo.foo = true;
	bar.bar = true;

	assert.deepEqual(
		foo,
		{
			a: 'a of foo',
			b: 'b of foo',
			c: 'c of foo',
			d: 'd of foo',
			foo: true
		},
		'Foo has expected properties'
	);

	assert.deepEqual(
		bar,
		{
			a: 'a of foo',
			b: 'b of bar',
			c: 'c of bar',
			d: 'd of foo',
			foo: true,
			bar: true
		},
		'Bar has expected properties'
	);

	fooKeys = Object.keys( foo );
	barKeys = Object.keys( bar );

	assert.deepEqual(
		fooKeys,
		['a', 'b', 'c', 'd', 'foo'],
		'Own properties of foo'
	);

	assert.deepEqual(
		barKeys,
		['b', 'c', 'bar'],
		'Own properties of bar'
	);
} );

QUnit.test( 'inheritClass', 18, function ( assert ) {
	var foo, bar;

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

QUnit.test( 'copy', 7, function ( assert ) {
	var simpleArray = [ 'foo', 3, true, false ],
		withObj = [ { 'bar': 'baz', 'quux': 3 }, 5, null ],
		nestedArray = [ [ 'a', 'b' ], [ 1, 3, 4 ] ],
		sparseArray = [ 'a', undefined, undefined, 'b' ],
		withSparseArray = [ [ 'a', undefined, undefined, 'b' ] ],
		withFunction = [ function () { return true; } ],
		Cloneable = function ( p ) {
			this.p = p;
		};

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
} );

QUnit.test( 'copy', 7, function ( assert ) {
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

}( OO ) );
