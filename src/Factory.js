/**
 * @class OO.Factory
 * @extends OO.Registry
 *
 * @constructor
 */
oo.Factory = function OoFactory() {
	oo.Factory.parent.call( this );

	// Properties
	this.entries = [];
};

/* Inheritance */

oo.inheritClass( oo.Factory, oo.Registry );

/* Methods */

/**
 * Register a constructor with the factory.
 *
 * Classes must have a static `name` property to be registered.
 *
 *     function MyClass() {};
 *     OO.initClass( MyClass );
 *     // Adds a static property to the class defining a symbolic name
 *     MyClass.static.name = 'mine';
 *     // Registers class with factory, available via symbolic name 'mine'
 *     factory.register( MyClass );
 *
 * @param {Function} constructor Constructor to use when creating object
 * @throws {Error} Name must be a string and must not be empty
 * @throws {Error} Constructor must be a function
 */
oo.Factory.prototype.register = function ( constructor ) {
	var name;

	if ( typeof constructor !== 'function' ) {
		throw new Error( 'constructor must be a function, cannot be a ' + typeof constructor );
	}
	name = constructor.static && constructor.static.name;
	if ( typeof name !== 'string' || name === '' ) {
		throw new Error( 'Name must be a string and must not be empty' );
	}
	this.entries.push( name );

	oo.Factory.parent.prototype.register.call( this, name, constructor );
};

/**
 * Create an object based on a name.
 *
 * Name is used to look up the constructor to use, while all additional arguments are passed to the
 * constructor directly, so leaving one out will pass an undefined to the constructor.
 *
 * @param {string} name Object name
 * @param {Mixed...} [args] Arguments to pass to the constructor
 * @return {Object} The new object
 * @throws {Error} Unknown object name
 */
oo.Factory.prototype.create = function ( name ) {
	var args, obj, constructor;

	if ( !this.registry.hasOwnProperty( name ) ) {
		throw new Error( 'No class registered by that name: ' + name );
	}
	constructor = this.registry[name];

	// Convert arguments to array and shift the first argument (name) off
	args = Array.prototype.slice.call( arguments, 1 );

	// We can't use the "new" operator with .apply directly because apply needs a
	// context. So instead just do what "new" does: create an object that inherits from
	// the constructor's prototype (which also makes it an "instanceof" the constructor),
	// then invoke the constructor with the object as context, and return it (ignoring
	// the constructor's return value).
	obj = Object.create( constructor.prototype );
	constructor.apply( obj, args );
	return obj;
};
