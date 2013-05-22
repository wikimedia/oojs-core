( function ( global ) {

	var OO = {

		/**
		 * @param {Mixed} o
		 * @return {boolean}
		 */
		isAwesome: function ( o ) {
			return o !== undefined;
		}

	};

	/*jshint node:true */
	if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = OO;
	} else {
		global.OO = OO;
	}

}( this ) );
