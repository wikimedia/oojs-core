/**
 * Utility for creating iframes.
 *
 * @return {HTMLElement}
 */
QUnit.tmpIframe = function () {
	const iframe = document.createElement( 'iframe' );
	document.getElementById( 'qunit-fixture' ).appendChild( iframe );
	return iframe;
};
