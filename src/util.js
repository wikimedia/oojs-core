/* eslint-disable-next-line no-redeclare */
/* global hasOwn, toString */

/**
 * Assert whether a value is a plain object or not.
 *
 * @memberof OO
 * @param {any} obj
 * @return {boolean}
 */
OO.isPlainObject = function ( obj ) {
	// Optimise for common case where internal [[Class]] property is not "Object"
	if ( !obj || toString.call( obj ) !== '[object Object]' ) {
		return false;
	}

	var proto = Object.getPrototypeOf( obj );

	// Objects without prototype (e.g., `Object.create( null )`) are considered plain
	if ( !proto ) {
		return true;
	}

	// The 'isPrototypeOf' method is set on Object.prototype.
	return hasOwn.call( proto, 'isPrototypeOf' );
};
