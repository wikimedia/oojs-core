/**
 * @class
 */
OO.Factory = function OoFactory() {
	this.registry = new OO.Registry();
};

OO.initClass( OO.Factory );

/* Methods */

/**
 * Register a constructor with the factory.
 *
 *     function MyClass() {};
 *     OO.initClass( MyClass );
 *     MyClass.static.name = 'hello';
 *     // Register class with the factory, available via the symbolic name "hello"
 *     factory.register( MyClass );
 *
 * @param {Function} constructor Constructor to use when creating object
 * @param {string} [name] Symbolic name to use for #create().
 *  This parameter may be omitted in favour of letting the constructor decide
 *  its own name, through `constructor.static.name`.
 * @throws {Error} If a parameter is invalid
 */
OO.Factory.prototype.register = function ( constructor, name ) {
	if ( typeof constructor !== 'function' ) {
		throw new Error( 'constructor must be a function, got ' + typeof constructor );
	}
	if ( arguments.length <= 1 ) {
		name = constructor.static && constructor.static.name;
	}
	if ( typeof name !== 'string' || name === '' ) {
		throw new Error( 'name must be a non-empty string' );
	}

	this.registry.register( name, constructor );
};

/**
 * Unregister a constructor from the factory.
 *
 * @param {string|Function} name Constructor function or symbolic name to unregister
 * @throws {Error} If a parameter is invalid
 */
OO.Factory.prototype.unregister = function ( name ) {
	if ( typeof name === 'function' ) {
		name = name.static && name.static.name;
	}
	if ( typeof name !== 'string' || name === '' ) {
		throw new Error( 'name must be a non-empty string' );
	}

	this.registry.unregister( name );
};

/**
 * Get constructor for a given symbolic name.
 *
 * @param {string} name Symbolic name
 * @return {Function|undefined}
 */
OO.Factory.prototype.lookup = function ( name ) {
	return this.registry.lookup( name );
};

/**
 * Create an object based on a name.
 *
 * Name is used to look up the constructor to use, while all additional arguments are passed to the
 * constructor directly, so leaving one out will pass an undefined to the constructor.
 *
 * @param {string} name Object name
 * @param {...any} [args] Arguments to pass to the constructor
 * @return {Object} The new object
 * @throws {Error} Unknown object name
 */
OO.Factory.prototype.create = function ( name ) {
	var obj, i,
		args = [],
		constructor = this.lookup( name );

	if ( !constructor ) {
		throw new Error( 'No class registered by that name: ' + name );
	}

	// Convert arguments to array and shift the first argument (name) off
	for ( i = 1; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}

	// We can't use the "new" operator with .apply directly because apply needs a
	// context. So instead just do what "new" does: create an object that inherits from
	// the constructor's prototype (which also makes it an "instanceof" the constructor),
	// then invoke the constructor with the object as context, and return it (ignoring
	// the constructor's return value).
	obj = Object.create( constructor.prototype );
	constructor.apply( obj, args );
	return obj;
};
