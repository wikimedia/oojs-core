( function () {

	QUnit.module( 'Factory' );

	function Foo( a, b, c, d ) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}
	OO.initClass( Foo );
	Foo.static.name = 'my-foo';

	QUnit.test( 'invalid registration', function ( assert ) {
		var factory = new OO.Factory();

		assert.throws(
			function () {
				factory.register( 'not-a-function' );
			},
			Error,
			'register non-function as constructor'
		);
		assert.throws(
			function () {
				factory.register( function UnnamedExample() {} );
			},
			'register constructor without static.name'
		);
		assert.throws(
			function () {
				factory.unregister( 42 );
			},
			Error,
			'unregister non-function value as constructor'
		);
		assert.throws(
			function () {
				factory.unregister( function UnnamedExample() {} );
			},
			'register constructor without static.name'
		);
	} );

	QUnit.test( 'registeration and lookup', function ( assert ) {
		var factory = new OO.Factory();

		// Add and remove by constructor
		factory.register( Foo );
		assert.strictEqual( factory.lookup( 'my-foo' ), Foo );

		factory.unregister( Foo );
		assert.strictEqual( factory.lookup( 'my-foo' ), undefined );

		// Add and remove by name
		factory.register( Foo, 'a-name' );
		assert.strictEqual( factory.lookup( 'my-foo' ), undefined );
		assert.strictEqual( factory.lookup( 'a-name' ), Foo );

		factory.unregister( 'a-name' );
		assert.strictEqual( factory.lookup( 'a-name' ), undefined );

		// Unknown name should not throw
		factory.unregister( 'not-registered' );
	} );

	QUnit.test( 'invalid creation', function ( assert ) {
		var factory = new OO.Factory();

		assert.throws(
			function () {
				factory.create( 'my-foo', 23, 'foo', { bar: 'baz' } );
			},
			Error,
			'Throws an exception when trying to create a object of an unregistered type'
		);
	} );

	QUnit.test( 'valid creation', function ( assert ) {
		var obj,
			factory = new OO.Factory();

		factory.register( Foo );
		obj = factory.create( 'my-foo', 16, 'foo', { baz: 'quux' }, 5 );

		assert.ok( obj instanceof Foo, 'object inherits constructor prototype' );

		assert.deepEqual(
			obj,
			new Foo( 16, 'foo', { baz: 'quux' }, 5 ),
			'constructor function ran'
		);
	} );

}() );
