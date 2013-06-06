var
	/**
	 * Namespace for all classes, static methods and static properties.
	 * @class OO
	 * @singleton
	 */
	oo = {},
	hasOwn = oo.hasOwnProperty;

/* Class Methods */

/**
 * Utility for common usage of Object#create for inheriting from one
 * prototype to another.
 *
 * Beware: This redefines the prototype, call before setting your prototypes.
 * Beware: This redefines the prototype, can only be called once on a function.
 *  If called multiple times on the same function, the previous prototype is lost.
 *  This is how prototypal inheritance works, it can only be one straight chain
 *  (just like classical inheritance in PHP for example). If you need to work with
 *  multiple constructors consider storing an instance of the other constructor in a
 *  property instead, or perhaps use a mixin (see oo.mixinClass).
 *
 *     function Foo() {}
 *     Foo.prototype.jump = function () {};
 *
 *     function FooBar() {}
 *     oo.inheritClass( FooBar, Foo );
 *     FooBar.prop.feet = 2;
 *     FooBar.prototype.walk = function () {};
 *
 *     function FooBarQuux() {}
 *     OO.inheritClass( FooBarQuux, FooBar );
 *     FooBarQuux.prototype.jump = function () {};
 *
 *     FooBarQuux.prop.feet === 2;
 *     var fb = new FooBar();
 *     fb.jump();
 *     fb.walk();
 *     fb instanceof Foo && fb instanceof FooBar && fb instanceof FooBarQuux;
 *
 * @method
 * @param {Function} targetFn
 * @param {Function} originFn
 * @throws {Error} If target already inherits from origin
 */
oo.inheritClass = function ( targetFn, originFn ) {
	if ( targetFn.prototype instanceof originFn ) {
		throw new Error( 'Target already inherits from origin' );
	}

	var targetConstructor = targetFn.prototype.constructor;

	targetFn.prototype = Object.create( originFn.prototype );

	// Restore constructor property of targetFn
	targetFn.prototype.constructor = targetConstructor;

	// Extend static properties - always initialize both sides
	originFn.static = originFn.static || {};
	targetFn.static = Object.create( originFn.static );

	// Copy mixin tracking
	targetFn.mixins = originFn.mixins ? originFn.mixins.slice( 0 ) : [];
};

/**
 * Utility to copy over *own* prototype properties of a mixin.
 * The 'constructor' (whether implicit or explicit) is not copied over.
 *
 * This does not create inheritance to the origin. If inheritance is needed
 * use oo.inheritClass instead.
 *
 * Beware: This can redefine a prototype property, call before setting your prototypes.
 * Beware: Don't call before oo.inheritClass.
 *
 *     function Foo() {}
 *     function Context() {}
 *
 *     // Avoid repeating this code
 *     function ContextLazyLoad() {}
 *     ContextLazyLoad.prototype.getContext = function () {
 *         if ( !this.context ) {
 *             this.context = new Context();
 *         }
 *         return this.context;
 *     };
 *
 *     function FooBar() {}
 *     OO.inheritClass( FooBar, Foo );
 *     OO.mixinClass( FooBar, ContextLazyLoad );
 *
 * @method
 * @param {Function} targetFn
 * @param {Function} originFn
 */
oo.mixinClass = function ( targetFn, originFn ) {
	var key;

	// Copy prototype properties
	for ( key in originFn.prototype ) {
		if ( key !== 'constructor' && hasOwn.call( originFn.prototype, key ) ) {
			targetFn.prototype[key] = originFn.prototype[key];
		}
	}

	// Copy static properties - always initialize both sides
	targetFn.static = targetFn.static || {};
	if ( originFn.static ) {
		for ( key in originFn.static ) {
			if ( hasOwn.call( originFn.static, key ) ) {
				targetFn.static[key] = originFn.static[key];
			}
		}
	} else {
		originFn.static = {};
	}
};

/* Object Methods */

/**
 * Create a new object that is an instance of the same
 * constructor as the input, inherits from the same object
 * and contains the same own properties.
 *
 * This makes a shallow non-recursive copy of own properties.
 * To create a recursive copy of plain objects, use #copy.
 *
 *     var foo = new Person( mom, dad );
 *     foo.setAge( 21 );
 *     var foo2 = OO.cloneObject( foo );
 *     foo.setAge( 22 );
 *
 *     // Then
 *     foo2 !== foo; // true
 *     foo2 instanceof Person; // true
 *     foo2.getAge(); // 21
 *     foo.getAge(); // 22
 *
 * @method
 * @param {Object} origin
 * @return {Object} Clone of origin
 */
oo.cloneObject = function ( origin ) {
	var key, r;

	r = Object.create( origin.constructor.prototype );

	for ( key in origin ) {
		if ( hasOwn.call( origin, key ) ) {
			r[key] = origin[key];
		}
	}

	return r;
};

/**
 * Gets an array of all property values in an object.
 *
 * @method
 * @param {Object} Object to get values from
 * @returns {Array} List of object values
 */
oo.getObjectValues = function ( obj ) {
	var key, values;

	if ( obj !== Object( obj ) ) {
		throw new TypeError( 'Called on non-object' );
	}

	values = [];
	for ( key in obj ) {
		if ( hasOwn.call( obj, key ) ) {
			values[values.length] = obj[key];
		}
	}

	return values;
};

/**
 * Recursively compares properties between two objects.
 *
 * A false result may be caused by property inequality or by properties in one object missing from
 * the other. An asymmetrical test may also be performed, which checks only that properties in the
 * first object are present in the second object, but not the inverse.
 *
 * @method
 * @param {Object} a First object to compare
 * @param {Object} b Second object to compare
 * @param {boolean} [asymmetrical] Whether to check only that b contains values from a
 * @returns {boolean} If the objects contain the same values as each other
 */
oo.compare = function ( a, b, asymmetrical ) {
	var aValue, bValue, aType, bType, k;
	for ( k in a ) {
		aValue = a[k];
		bValue = b[k];
		aType = typeof aValue;
		bType = typeof bValue;
		if ( aType !== bType ||
			( ( aType === 'string' || aType === 'number' ) && aValue !== bValue ) ||
			( aValue === Object( aValue ) && !oo.compare( aValue, bValue, asymmetrical ) ) ) {
			return false;
		}
	}
	// If the check is not asymmetrical, recursing with the arguments swapped will verify our result
	return asymmetrical ? true : oo.compare( b, a, true );
};

/**
 * Create a plain deep copy of any kind of object.
 *
 * Copies are deep, and will either be an object or an array depending on `source`.
 *
 * @method
 * @param {Object} source Object to copy
 * @param {Function} [callback] Applied to leaf values before they added to the clone
 * @returns {Object} Copy of source object
 */
oo.copy = function ( source, callback ) {
	var key, sourceValue, sourceType, destination;

	if ( typeof source.clone === 'function' ) {
		return source.clone();
	}

	destination = Array.isArray( source ) ? new Array( source.length ) : {};

	for ( key in source ) {
		sourceValue = source[key];
		sourceType = typeof sourceValue;
		if ( Array.isArray( sourceValue ) ) {
			// Array
			destination[key] = oo.copy( sourceValue, callback );
		} else if ( sourceValue && typeof sourceValue.clone === 'function' ) {
			// Duck type object with custom clone method
			destination[key] = callback ?
				callback( sourceValue.clone() ) : sourceValue.clone();
		} else if ( sourceValue && typeof sourceValue.cloneNode === 'function' ) {
			// DOM Node
			destination[key] = callback ?
				callback( sourceValue.cloneNode( true ) ) : sourceValue.cloneNode( true );
		} else if ( sourceValue === Object( sourceValue ) && typeof sourceValue !== 'function' ) {
			// Other objects, except for functions that we cannot clone
			destination[key] = oo.copy( sourceValue, callback );
		} else {
			// Primitive values and functions
			destination[key] = callback ? callback( sourceValue ) : sourceValue;
		}
	}

	return destination;
};
