/*!
 * Factory test suite.
 *
 * @package OOJS
 */

( function ( oo ) {

QUnit.module( 'OO.Factory' );

/* Stubs */

oo.FactoryObjectStub = function OoFactoryObjectStub( a, b, c, d ) {
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
};

/* Tests */

QUnit.test( 'register', 1, function ( assert ) {
	var factory = new oo.Factory();
	assert.throws(
		function () {
			factory.register( 'factory-object-stub', 'not-a-function' );
		},
		Error,
		'Throws an exception when trying to register a non-function value as a constructor'
	);
} );

QUnit.test( 'create', 3, function ( assert ) {
	var obj,
		factory = new oo.Factory();

	assert.throws(
		function () {
			factory.create( 'factory-object-stub' );
		},
		Error,
		'Throws an exception when trying to create a object of an unregistered type'
	);

	factory.register( 'factory-object-stub', oo.FactoryObjectStub );

	obj = factory.create( 'factory-object-stub', 16, 'foo', { 'baz': 'quux' }, 5 );

	assert.deepEqual(
		obj,
		new oo.FactoryObjectStub( 16, 'foo', { 'baz': 'quux' }, 5 ),
		'Creates an object of the registered type and passes through arguments'
	);

	assert.strictEqual(
		obj instanceof oo.FactoryObjectStub,
		true,
		'Creates an object that is an instanceof the registered constructor'
	);
} );

}( OO ) );
