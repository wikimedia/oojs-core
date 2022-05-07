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
 * @param {string} [key] The key for #create().
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

// The constructor of native ES6 classes enforces use of the `new` operator through
// a check that we cannot approximate or bypass from generic ES5-compatible code,
// and thus would throw an error if we used Object.create() + Function.apply().
//
// Instead, in order to construct an ES6 class with variable arguments, one has to use
// either native E6-only syntax (new + spread operator) which prevents the entire library
// from being available to older browsers, or one has to use the ES6 Reflect API.
// We choose the latter.
//
// eslint-disable-next-line no-undef
var construct = ( typeof Reflect !== 'undefined' && Reflect.construct ) ? Reflect.construct :
	// This is used and covered via Karma in IE11, but we don't collect coverage there.
	/* istanbul ignore next */
	function ( target, args ) {
		// We can't use the "new" operator with .apply directly because apply needs a
		// context. So instead just do what "new" does: create an object that inherits from
		// the constructor's prototype (which also makes it an "instanceof" the constructor),
		// then invoke the constructor with the object as context, and return it (ignoring
		// any constructor's return value).
		var obj = Object.create( target.prototype );
		target.apply( obj, args );
		return obj;
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
OO.Factory.prototype.create = function ( key ) {
	var constructor = this.lookup( key );
	if ( !constructor ) {
		throw new Error( 'No class registered by that key: ' + key );
	}

	// Convert arguments to array and shift the first argument (key) off
	var args = [];
	for ( var i = 1; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}

	return construct( constructor, args );
};
