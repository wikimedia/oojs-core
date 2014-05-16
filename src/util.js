/*global hasOwn, toString */

/**
 * Assert whether a value is a plain object or not.
 *
 * @param {Mixed} obj
 * @return {boolean}
 */
oo.isPlainObject = function ( obj ) {
	// Any object or value whose internal [[Class]] property is not "[object Object]"
	if ( toString.call( obj ) !== '[object Object]' ) {
		return false;
	}

	// The try/catch suppresses exceptions thrown when attempting to access
	// the "constructor" property of certain host objects suich as window.location
	// in Firefox < 20 (https://bugzilla.mozilla.org/814622)
	try {
		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, 'isPrototypeOf' ) ) {
			return false;
		}
	} catch ( e ) {
		return false;
	}

	return true;
};
