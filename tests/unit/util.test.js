( function ( oo, global ) {

	QUnit.module( 'util' );

	QUnit.test( 'isPlainObject', function ( assert ) {
		var obj;
		function Thing() {}

		// Plain objects
		assert.strictEqual( oo.isPlainObject( {} ), true, 'empty plain object' );
		assert.strictEqual( oo.isPlainObject( { a: 1 } ), true, 'non-empty plain object' );
		assert.strictEqual( oo.isPlainObject( Object.create( null ) ), true, 'empty object with no prototype, via Object.create( null )' );
		obj = Object.create( null );
		obj.foo = true;
		assert.strictEqual( oo.isPlainObject( obj ), true, 'non-empty object with no prototype' );

		// Non-plain objects (any inheritance other than Object.prototype is not plain)
		obj = Object.create( Object.create( null ) );
		assert.strictEqual( oo.isPlainObject( obj ), false, 'empty object inheriting from object with no prototype' );
		obj.foo = true;
		assert.strictEqual( oo.isPlainObject( obj ), false, 'non-empty object inheriting from object with no prototype' );
		obj = Object.create( {} );
		assert.strictEqual( oo.isPlainObject( obj ), false, 'object inheriting from plain object' );

		// Primitives
		assert.strictEqual( oo.isPlainObject( undefined ), false, 'undefined' );
		assert.strictEqual( oo.isPlainObject( null ), false, 'null' );
		assert.strictEqual( oo.isPlainObject( false ), false, 'boolean false' );
		assert.strictEqual( oo.isPlainObject( true ), false, 'boolean true' );
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
	} );

	if ( global.document ) {
		QUnit.test( 'isPlainObject - browser specific', function ( assert ) {
			var IframeObject, threw;

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

			IframeObject = QUnit.tmpIframe().contentWindow.Object;

			assert.strictEqual(
				typeof IframeObject,
				'function',
				'Object constructor found'
			);

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
			assert.strictEqual( threw, false, 'native Location object' );
		} );
	}

}( OO, this ) );
