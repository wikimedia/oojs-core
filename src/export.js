/* eslint-env node */

/* istanbul ignore next */
if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = oo;
} else {
	global.OO = oo;
}
