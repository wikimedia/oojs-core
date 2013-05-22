QUnit.module( 'oojs' );

QUnit.test( 'isAwesome', 1, function ( assert ) {
	assert.strictEqual( OO.isAwesome( 42 ), true, 'The Answer is awesome.' );
} );
