( function () {

	QUnit.module( 'Factory' );

	class Foo {
		constructor( a, b, c, d ) {
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
		}
	}
	Foo.key = 'my-foo';

	function Bar( a, b, c, d ) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}
	OO.initClass( Bar );
	Bar.static.name = 'my-bar';

	function Quux( a, b, c, d ) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}
	OO.initClass( Quux );
	Quux.key = 'my-quux';
	Quux.static.name = 'not-quite-right';

	QUnit.test( 'invalid registration', function ( assert ) {
		var factory = new OO.Factory();

		assert.throws(
			function () {
				factory.register( 'not-a-function' );
			},
			Error,
			'register non-function value'
		);
		assert.throws(
			function () {
				factory.register( function UnnamedExample() {} );
			},
			'register class without a key'
		);
		assert.throws(
			function () {
				factory.unregister( 42 );
			},
			Error,
			'unregister non-function value'
		);
		assert.throws(
			function () {
				factory.unregister( function UnnamedExample() {} );
			},
			'unregister class without a key'
		);
	} );

	QUnit.test.each( 'registeration and lookup', {
		'Class.key': [ Foo, 'my-foo' ],
		'Class.static.name': [ Bar, 'my-bar' ],
		'key and name': [ Quux, 'my-quux' ]
	}, function ( assert, data ) {
		var Class = data[ 0 ];
		var key = data[ 1 ];

		var factory = new OO.Factory();

		// Add and remove by constructor
		factory.register( Class );
		assert.strictEqual( factory.lookup( key ), Class );
		factory.unregister( Class );
		assert.strictEqual( factory.lookup( key ), undefined );

		// Add and remove by key
		factory.register( Class, 'different-key' );
		assert.strictEqual( factory.lookup( key ), undefined );
		assert.strictEqual( factory.lookup( 'different-key' ), Class );
		factory.unregister( 'different-key' );
		assert.strictEqual( factory.lookup( 'different-key' ), undefined );
	} );

	QUnit.test( 'registeration and lookup [unknown]', function ( assert ) {
		assert.expect( 0 );

		// Unknown key should not throw
		var factory = new OO.Factory();
		factory.unregister( 'not-registered' );
	} );

	QUnit.test( 'invalid creation', function ( assert ) {
		var factory = new OO.Factory();

		assert.throws(
			function () {
				factory.create( 'my-foo', 23, 'foo', { bar: 'baz' } );
			},
			Error,
			'try to create a object from an unregistered key'
		);
	} );

	QUnit.test( 'valid creation', function ( assert ) {
		var factory = new OO.Factory();

		factory.register( Foo );
		var obj = factory.create( 'my-foo', 16, 'foo', { baz: 'quux' }, 5 );

		assert.true( obj instanceof Foo, 'object inherits constructor prototype' );

		assert.deepEqual(
			obj,
			new Foo( 16, 'foo', { baz: 'quux' }, 5 ),
			'constructor function ran'
		);
	} );

}() );
