( function () {
	// Extend QUnit.module to provide a fixture element. This used to be in tests/index.html, but
	// dynamic test runners like Karma build their own web page.
	( function () {
		var orgModule = QUnit.module;

		QUnit.module = function ( name, localEnv ) {
			localEnv = localEnv || {};
			orgModule( name, {
				beforeEach: function () {
					this.fixture = document.createElement( 'div' );
					this.fixture.id = 'qunit-fixture';
					document.body.appendChild( this.fixture );

					if ( localEnv.name ) {
						localEnv.name.call( this );
					}
				},
				afterEach: function () {
					if ( localEnv.afterEach ) {
						localEnv.afterEach.call( this );
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
		// Will be removed automatically by afterEach
		document.getElementById( 'qunit-fixture' ).appendChild( iframe );
		return iframe;
	};

}() );
