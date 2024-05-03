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

	QUnit.test( 'invalid registration', ( assert ) => {
		const factory = new OO.Factory();

		assert.throws(
			() => {
				factory.register( 'not-a-function' );
			},
			Error,
			'register non-function value'
		);
		assert.throws(
			() => {
				factory.register( () => {} );
			},
			'register class without a key'
		);
		assert.throws(
			() => {
				factory.unregister( 42 );
			},
			Error,
			'unregister non-function value'
		);
		assert.throws(
			() => {
				factory.unregister( () => {} );
			},
			'unregister class without a key'
		);
	} );

	QUnit.test.each( 'registeration and lookup', {
		'Class.key': [ Foo, 'my-foo' ],
		'Class.static.name': [ Bar, 'my-bar' ],
		'key and name': [ Quux, 'my-quux' ]
	}, ( assert, data ) => {
		const Class = data[ 0 ];
		const key = data[ 1 ];

		const factory = new OO.Factory();

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

	QUnit.test( 'registeration and lookup [unknown]', ( assert ) => {
		assert.expect( 0 );

		// Unknown key should not throw
		const factory = new OO.Factory();
		factory.unregister( 'not-registered' );
	} );

	QUnit.test( 'invalid creation', ( assert ) => {
		const factory = new OO.Factory();

		assert.throws(
			() => {
				factory.create( 'my-foo', 23, 'foo', { bar: 'baz' } );
			},
			Error,
			'try to create a object from an unregistered key'
		);
	} );

	QUnit.test( 'valid creation', ( assert ) => {
		const factory = new OO.Factory();

		factory.register( Foo );
		const obj = factory.create( 'my-foo', 16, 'foo', { baz: 'quux' }, 5 );

		assert.true( obj instanceof Foo, 'object inherits constructor prototype' );

		assert.deepEqual(
			obj,
			new Foo( 16, 'foo', { baz: 'quux' }, 5 ),
			'constructor function ran'
		);
	} );

}() );
