( function () {
	// Extend QUnit.module to provide a fixture element. This used to be in tests/index.html, but
	// dynamic test runners like Karma build their own web page.
	( function () {
		var orgModule = QUnit.module;

		QUnit.module = function ( name, localEnv ) {
			localEnv = localEnv || {};
			orgModule( name, {
				setup: function () {
					this.fixture = document.createElement( 'div' );
					this.fixture.id = 'qunit-fixture';
					document.body.appendChild( this.fixture );

					if ( localEnv.setup ) {
						localEnv.setup.call( this );
					}
				},
				teardown: function () {
					if ( localEnv.teardown ) {
						localEnv.teardown.call( this );
					}

					this.fixture.parentNode.removeChild( this.fixture );
				}
			} );
		};
	}() );

	/**
	 * Utility for creating iframes.
	 * @return {HTMLElement}
	 */
	QUnit.tmpIframe = function () {
		var iframe = document.createElement( 'iframe' );
		// Will be removed automatically by module teardown
		document.getElementById( 'qunit-fixture' ).appendChild( iframe );
		return iframe;
	};

}() );
