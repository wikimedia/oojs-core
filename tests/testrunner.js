( function ( global ) {
	/*jshint browser:true, evil:true */
	var supportsES5 = ( function () {
		'use strict';
		return !this;
	}() );

	if ( !supportsES5 ) {
		if ( global.JSON ) {
			// Assume JSON methods are broken in non-ES5 browsers and polyfill them
			// Support IE8: The native JSON implementation in IE8 seems to have an issue with the
			// way OO.getHash uses the JSON.stringify with a replacer function, occasionally
			// throwing "Unexpected call to method or property access."
			global.JSON = undefined;
		}
		document.write( '<script src="../lib/json2.js"></script>' );
		document.write( '<script src="../lib/es5-shim.js"></script>' );
		document.write( '<script src="./polyfill-object-create.js"></script>' );
	}

	// Expose
	QUnit.supportsES5 = supportsES5;

	// Configure QUnit
	QUnit.config.requireExpects = true;

	/**
	 * Utility for creating iframes
	 * @param {Function} callback Called when the iframe is done
	 * @param {HTMLElement} callback.iframe
	 * @param {Function} callback.teardown To be called when user is done (performs cleanup and resumes
	 *  QUnit runner).
	 */
	QUnit.tmpIframe = function ( callback ) {
		var iframe = global.document.createElement( 'iframe' );
		global.document.getElementById( 'qunit-fixture' ).appendChild( iframe );

		// Support IE8: Without "src", the contentWindow has no 'Object' constructor.
		/*jshint scripturl:true */
		iframe.src = 'javascript:';

		// Support IE6: Iframe contentWindow is populated asynchronously.
		QUnit.stop();
		global.setTimeout( function () {
			callback( iframe, function () {

				iframe.parentNode.removeChild( iframe );
				iframe = undefined;
				QUnit.start();
			} );
		} );
	};

}( this ) );
