/**
 * @class
 * @extends OO.Registry
 */
OO.Factory = function OoFactory() {
	// Parent constructor
	OO.Factory.super.call( this );
};

/* Inheritance */

OO.inheritClass( OO.Factory, OO.Registry );

/* Methods */

/**
 * Register a class with the factory.
 *
 *     function MyClass() {};
 *     OO.initClass( MyClass );
 *     MyClass.key = 'hello';
 *
 *     // Register class with the factory
 *     factory.register( MyClass );
 *
 *     // Instantiate a class based on its registered key (also known as a "symbolic name")
 *     factory.create( 'hello' );
 *
 * @param {Function} constructor Class to use when creating an object
 * @param {string} [key] The key for {@link OO.Factory#create|create()}.
 *  This parameter is usually omitted in favour of letting the class declare
 *  its own key, through `MyClass.key`.
 *  For backwards-compatiblity with OOjs 6.0 (2021) and older, it can also be declared
 *  via `MyClass.static.name`.
 * @throws {Error} If a parameter is invalid
 */
OO.Factory.prototype.register = function ( constructor, key ) {
	if ( typeof constructor !== 'function' ) {
		throw new Error( 'constructor must be a function, got ' + typeof constructor );
	}
	if ( arguments.length <= 1 ) {
		key = constructor.key || ( constructor.static && constructor.static.name );
	}
	if ( typeof key !== 'string' || key === '' ) {
		throw new Error( 'key must be a non-empty string' );
	}

	// Parent method
	OO.Factory.super.prototype.register.call( this, key, constructor );
};

/**
 * Unregister a class from the factory.
 *
 * @param {string|Function} key Constructor function or key to unregister
 * @throws {Error} If a parameter is invalid
 */
OO.Factory.prototype.unregister = function ( key ) {
	if ( typeof key === 'function' ) {
		key = key.key || ( key.static && key.static.name );
	}
	if ( typeof key !== 'string' || key === '' ) {
		throw new Error( 'key must be a non-empty string' );
	}

	// Parent method
	OO.Factory.super.prototype.unregister.call( this, key );
};

/**
 * Create an object based on a key.
 *
 * The key is used to look up the class to use, with any subsequent arguments passed to the
 * constructor function.
 *
 * @param {string} key Class key
 * @param {...any} [args] Arguments to pass to the constructor
 * @return {Object} The new object
 * @throws {Error} Unknown key
 */
OO.Factory.prototype.create = function ( key, ...args ) {
	const constructor = this.lookup( key );
	if ( !constructor ) {
		throw new Error( 'No class registered by that key: ' + key );
	}

	return new constructor( ...args );
};
