/*!
 * Util test suite.
 */

( function ( oo, global ) {

	QUnit.module( 'util' );

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

}( OO, this ) );
