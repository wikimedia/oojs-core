/* eslint-env node */

/* istanbul ignore next */
if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = OO;
} else {
	global.OO = OO;
}
