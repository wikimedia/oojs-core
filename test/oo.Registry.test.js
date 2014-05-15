/*!
 * Registry test suite.
 */

( function ( oo ) {

	QUnit.module( 'OO.Registry' );

	/* Tests */

	QUnit.test( 'register', 3, function ( assert ) {
		var registry = new oo.Registry();

		registry.register( 'registry-item-1', 1 );
		registry.register( [ 'registry-item-2', 'registry-item-3' ], 23 );

		assert.strictEqual( registry.lookup( 'registry-item-1' ), 1 );
		assert.strictEqual( registry.lookup( 'registry-item-2' ), 23 );
		assert.strictEqual( registry.lookup( 'registry-item-3' ), 23 );
	} );

	QUnit.test( 'lookup', 2, function ( assert ) {
		var registry = new oo.Registry();

		registry.register( 'registry-item-1', 1 );

		assert.strictEqual( registry.lookup( 'registry-item-1' ), 1 );
		assert.strictEqual( registry.lookup( 'registry-item-2' ), undefined );
	} );

}( OO ) );
