/* global hasOwn */

/**
 * A map interface for associating arbitrary data with a symbolic name. Used in
 * place of a plain object to provide additional {@link OO.Registry#register registration}
 * or {@link OO.Registry#lookup lookup} functionality.
 *
 * See <https://www.mediawiki.org/wiki/OOjs/Registries_and_factories>.
 *
 * @class
 * @mixes OO.EventEmitter
 */
OO.Registry = function OoRegistry() {
	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.registry = {};
};

/* Inheritance */

OO.mixinClass( OO.Registry, OO.EventEmitter );

/* Events */

/**
 * @event OO.Registry#register
 * @param {string} name
 * @param {any} data
 */

/**
 * @event OO.Registry#unregister
 * @param {string} name
 * @param {any} data Data removed from registry
 */

/* Methods */

/**
 * Associate one or more symbolic names with some data.
 *
 * Any existing entry with the same name will be overridden.
 *
 * @param {string|string[]} name Symbolic name or list of symbolic names
 * @param {any} data Data to associate with symbolic name
 * @fires OO.Registry#register
 * @throws {Error} Name argument must be a string or array
 */
OO.Registry.prototype.register = function ( name, data ) {
	if ( typeof name === 'string' ) {
		this.registry[ name ] = data;
		this.emit( 'register', name, data );
	} else if ( Array.isArray( name ) ) {
		for ( let i = 0, len = name.length; i < len; i++ ) {
			this.register( name[ i ], data );
		}
	} else {
		throw new Error( 'Name must be a string or array, cannot be a ' + typeof name );
	}
};

/**
 * Remove one or more symbolic names from the registry.
 *
 * @param {string|string[]} name Symbolic name or list of symbolic names
 * @fires OO.Registry#unregister
 * @throws {Error} Name argument must be a string or array
 */
OO.Registry.prototype.unregister = function ( name ) {
	if ( typeof name === 'string' ) {
		const data = this.lookup( name );
		if ( data !== undefined ) {
			delete this.registry[ name ];
			this.emit( 'unregister', name, data );
		}
	} else if ( Array.isArray( name ) ) {
		for ( let i = 0, len = name.length; i < len; i++ ) {
			this.unregister( name[ i ] );
		}
	} else {
		throw new Error( 'Name must be a string or array, cannot be a ' + typeof name );
	}
};

/**
 * Get data for a given symbolic name.
 *
 * @param {string} name Symbolic name
 * @return {any|undefined} Data associated with symbolic name
 */
OO.Registry.prototype.lookup = function ( name ) {
	if ( hasOwn.call( this.registry, name ) ) {
		return this.registry[ name ];
	}
};
