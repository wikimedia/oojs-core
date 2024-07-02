/* exported slice, toString */
/**
 * Namespace for all classes, static methods and static properties.
 *
 * @namespace OO
 */
const
	// eslint-disable-next-line no-redeclare
	OO = {},
	// Optimisation: Local reference to methods from a global prototype
	hasOwn = OO.hasOwnProperty,
	// eslint-disable-next-line no-redeclare
	toString = OO.toString;

/* Class Methods */

/**
 * Utility to initialize a class for OO inheritance.
 *
 * Currently this just initializes an empty static object.
 *
 * @memberof OO
 * @method initClass
 * @param {Function} fn
 */
OO.initClass = function ( fn ) {
	fn.static = fn.static || {};
};

/**
 * Inherit from prototype to another using Object.create.
 *
 * Beware: This redefines the prototype, call before setting your prototypes.
 *
 * Beware: This redefines the prototype, can only be called once on a function.
 * If called multiple times on the same function, the previous prototype is lost.
 * This is how prototypal inheritance works, it can only be one straight chain
 * (just like classical inheritance in PHP for example). If you need to work with
 * multiple constructors consider storing an instance of the other constructor in a
 * property instead, or perhaps use a mixin (see {@link OO.mixinClass}).
 *
 * @example
 * function Thing() {}
 * Thing.prototype.exists = function () {};
 *
 * function Person() {
 *     Person.super.apply( this, arguments );
 * }
 * OO.inheritClass( Person, Thing );
 * Person.static.defaultEyeCount = 2;
 * Person.prototype.walk = function () {};
 *
 * function Jumper() {
 *     Jumper.super.apply( this, arguments );
 * }
 * OO.inheritClass( Jumper, Person );
 * Jumper.prototype.jump = function () {};
 *
 * Jumper.static.defaultEyeCount === 2;
 * var x = new Jumper();
 * x.jump();
 * x.walk();
 * x instanceof Thing && x instanceof Person && x instanceof Jumper;
 *
 * @memberof OO
 * @method inheritClass
 * @param {Function} targetFn
 * @param {Function} originFn
 * @throws {Error} If target already inherits from origin
 */
OO.inheritClass = function ( targetFn, originFn ) {
	if ( !originFn ) {
		throw new Error( 'inheritClass: Origin is not a function (actually ' + originFn + ')' );
	}
	if ( targetFn.prototype instanceof originFn ) {
		throw new Error( 'inheritClass: Target already inherits from origin' );
	}

	const targetConstructor = targetFn.prototype.constructor;

	// [DEPRECATED] Provide .parent as alias for code supporting older browsers which
	// allows people to comply with their style guide.
	targetFn.super = targetFn.parent = originFn;

	targetFn.prototype = Object.create( originFn.prototype, {
		// Restore constructor property of targetFn
		constructor: {
			value: targetConstructor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	} );

	// Extend static properties - always initialize both sides
	OO.initClass( originFn );
	targetFn.static = Object.create( originFn.static );
};

/**
 * Copy over *own* prototype properties of a mixin.
 *
 * The 'constructor' (whether implicit or explicit) is not copied over.
 *
 * This does not create inheritance to the origin. If you need inheritance,
 * use {@link OO.inheritClass} instead.
 *
 * Beware: This can redefine a prototype property, call before setting your prototypes.
 *
 * Beware: Don't call before {@link OO.inheritClass}.
 *
 * @example
 * function Foo() {}
 * function Context() {}
 *
 * // Avoid repeating this code
 * function ContextLazyLoad() {}
 * ContextLazyLoad.prototype.getContext = function () {
 *     if ( !this.context ) {
 *         this.context = new Context();
 *     }
 *     return this.context;
 * };
 *
 * function FooBar() {}
 * OO.inheritClass( FooBar, Foo );
 * OO.mixinClass( FooBar, ContextLazyLoad );
 *
 * @memberof OO
 * @method mixinClass
 * @param {Function} targetFn
 * @param {Function} originFn
 */
OO.mixinClass = function ( targetFn, originFn ) {
	if ( !originFn ) {
		throw new Error( 'mixinClass: Origin is not a function (actually ' + originFn + ')' );
	}

	let key;
	// Copy prototype properties
	for ( key in originFn.prototype ) {
		if ( key !== 'constructor' && hasOwn.call( originFn.prototype, key ) ) {
			targetFn.prototype[ key ] = originFn.prototype[ key ];
		}
	}

	// Copy static properties - always initialize both sides
	OO.initClass( targetFn );
	if ( originFn.static ) {
		for ( key in originFn.static ) {
			if ( hasOwn.call( originFn.static, key ) ) {
				targetFn.static[ key ] = originFn.static[ key ];
			}
		}
	} else {
		OO.initClass( originFn );
	}
};

/**
 * Test whether one class is a subclass of another, without instantiating it.
 *
 * Every class is considered a subclass of Object and of itself.
 *
 * @memberof OO
 * @method isSubclass
 * @param {Function} testFn The class to be tested
 * @param {Function} baseFn The base class
 * @return {boolean} Whether testFn is a subclass of baseFn (or equal to it)
 */
OO.isSubclass = function ( testFn, baseFn ) {
	return testFn === baseFn || testFn.prototype instanceof baseFn;
};

/* Object Methods */

/**
 * Get a deeply nested property of an object using variadic arguments, protecting against
 * undefined property errors.
 *
 * `quux = OO.getProp( obj, 'foo', 'bar', 'baz' );` is equivalent to `quux = obj.foo.bar.baz;`
 * except that the former protects against JS errors if one of the intermediate properties
 * is undefined. Instead of throwing an error, this function will return undefined in
 * that case.
 *
 * @memberof OO
 * @method getProp
 * @param {Object} obj
 * @param {...any} [keys]
 * @return {Object|undefined} obj[arguments[1]][arguments[2]].... or undefined
 */
OO.getProp = function ( obj, ...keys ) {
	let retval = obj;
	for ( let i = 0; i < keys.length; i++ ) {
		if ( retval === undefined || retval === null ) {
			// Trying to access a property of undefined or null causes an error
			return undefined;
		}
		retval = retval[ keys[ i ] ];
	}
	return retval;
};

/**
 * Set a deeply nested property of an object using variadic arguments, protecting against
 * undefined property errors.
 *
 * `OO.setProp( obj, 'foo', 'bar', 'baz' );` is equivalent to `obj.foo.bar = baz;` except that
 * the former protects against JS errors if one of the intermediate properties is
 * undefined. Instead of throwing an error, undefined intermediate properties will be
 * initialized to an empty object. If an intermediate property is not an object, or if obj itself
 * is not an object, this function will silently abort.
 *
 * @memberof OO
 * @method setProp
 * @param {Object} obj
 * @param {...any} [keys]
 * @param {any} [value]
 */
OO.setProp = function ( obj, ...keys ) {
	const value = keys.pop();
	if ( Object( obj ) !== obj || !keys.length ) {
		return;
	}
	let prop = obj;
	for ( let i = 0; i < keys.length - 1; i++ ) {
		if ( prop[ keys[ i ] ] === undefined ) {
			prop[ keys[ i ] ] = {};
		}
		if ( Object( prop[ keys[ i ] ] ) !== prop[ keys[ i ] ] ) {
			return;
		}
		prop = prop[ keys[ i ] ];
	}
	prop[ keys[ keys.length - 1 ] ] = value;
};

/**
 * Delete a deeply nested property of an object using variadic arguments, protecting against
 * undefined property errors, and deleting resulting empty objects.
 *
 * @memberof OO
 * @method deleteProp
 * @param {Object} obj
 * @param {...any} [keys]
 */
OO.deleteProp = function ( obj, ...keys ) {
	if ( Object( obj ) !== obj || !keys.length ) {
		return;
	}
	let prop = obj;
	const props = [ prop ];
	let i = 0;
	for ( ; i < keys.length - 1; i++ ) {
		if (
			prop[ keys[ i ] ] === undefined ||
			Object( prop[ keys[ i ] ] ) !== prop[ keys[ i ] ]
		) {
			return;
		}
		prop = prop[ keys[ i ] ];
		props.push( prop );
	}
	delete prop[ keys[ i ] ];
	// Walk back through props removing any plain empty objects
	while (
		props.length > 1 &&
		( prop = props.pop() ) &&

		OO.isPlainObject( prop ) && !Object.keys( prop ).length
	) {
		delete props[ props.length - 1 ][ keys[ props.length - 1 ] ];
	}
};

/**
 * Create a new object that is an instance of the same
 * constructor as the input, inherits from the same object
 * and contains the same own properties.
 *
 * This makes a shallow non-recursive copy of own properties.
 * To create a recursive copy of plain objects, use {@link .copy}.
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
 * @memberof OO
 * @method cloneObject
 * @param {Object} origin
 * @return {Object} Clone of origin
 */
OO.cloneObject = function ( origin ) {
	const r = Object.create( Object.getPrototypeOf( origin ) );

	for ( const key in origin ) {
		if ( hasOwn.call( origin, key ) ) {
			r[ key ] = origin[ key ];
		}
	}

	return r;
};

/**
 * Get an array of all property values in an object.
 *
 * @memberof OO
 * @method getObjectValues
 * @param {Object} obj Object to get values from
 * @return {Array} List of object values
 */
OO.getObjectValues = function ( obj ) {
	if ( obj !== Object( obj ) ) {
		throw new TypeError( 'Called on non-object' );
	}

	const values = [];
	for ( const key in obj ) {
		if ( hasOwn.call( obj, key ) ) {
			values[ values.length ] = obj[ key ];
		}
	}

	return values;
};

/**
 * Use binary search to locate an element in a sorted array.
 *
 * searchFunc is given an element from the array. `searchFunc(elem)` must return a number
 * above 0 if the element we're searching for is to the right of (has a higher index than) elem,
 * below 0 if it is to the left of elem, or zero if it's equal to elem.
 *
 * To search for a specific value with a comparator function (a `function cmp(a,b)` that returns
 * above 0 if `a > b`, below 0 if `a < b`, and 0 if `a == b`), you can use
 * `searchFunc = cmp.bind( null, value )`.
 *
 * @memberof OO
 * @method binarySearch
 * @param {Array} arr Array to search in
 * @param {Function} searchFunc Search function
 * @param {boolean} [forInsertion] If not found, return index where val could be inserted
 * @return {number|null} Index where val was found, or null if not found
 */
OO.binarySearch = function ( arr, searchFunc, forInsertion ) {
	let left = 0;
	let right = arr.length;
	while ( left < right ) {
		// Equivalent to Math.floor( ( left + right ) / 2 ) but much faster
		// eslint-disable-next-line no-bitwise
		const mid = ( left + right ) >> 1;
		const cmpResult = searchFunc( arr[ mid ] );
		if ( cmpResult < 0 ) {
			right = mid;
		} else if ( cmpResult > 0 ) {
			left = mid + 1;
		} else {
			return mid;
		}
	}
	return forInsertion ? right : null;
};

/**
 * Recursively compare properties between two objects.
 *
 * A false result may be caused by property inequality or by properties in one object missing from
 * the other. An asymmetrical test may also be performed, which checks only that properties in the
 * first object are present in the second object, but not the inverse.
 *
 * If either a or b is null or undefined it will be treated as an empty object.
 *
 * @memberof OO
 * @method compare
 * @param {Object|undefined|null} a First object to compare
 * @param {Object|undefined|null} b Second object to compare
 * @param {boolean} [asymmetrical] Whether to check only that a's values are equal to b's
 *  (i.e. a is a subset of b)
 * @return {boolean} If the objects contain the same values as each other
 */
OO.compare = function ( a, b, asymmetrical ) {
	if ( a === b ) {
		return true;
	}

	a = a || {};
	b = b || {};

	if ( typeof a.nodeType === 'number' && typeof a.isEqualNode === 'function' ) {
		return a.isEqualNode( b );
	}

	for ( const k in a ) {
		if ( !hasOwn.call( a, k ) || a[ k ] === undefined || a[ k ] === b[ k ] ) {
			// Ignore undefined values, because there is no conceptual difference between
			// a key that is absent and a key that is present but whose value is undefined.
			continue;
		}

		const aValue = a[ k ];
		const bValue = b[ k ];
		const aType = typeof aValue;
		const bType = typeof bValue;
		if ( aType !== bType ||
			(
				( aType === 'string' || aType === 'number' || aType === 'boolean' ) &&
				aValue !== bValue
			) ||
			( aValue === Object( aValue ) && !OO.compare( aValue, bValue, true ) ) ) {
			return false;
		}
	}
	// If the check is not asymmetrical, recursing with the arguments swapped will verify our result
	return asymmetrical ? true : OO.compare( b, a, true );
};

/**
 * Create a plain deep copy of any kind of object.
 *
 * Copies are deep, and will either be an object or an array depending on `source`.
 *
 * @memberof OO
 * @method copy
 * @param {Object} source Object to copy
 * @param {Function} [leafCallback] Applied to leaf values after they are cloned but before they are
 *  added to the clone
 * @param {Function} [nodeCallback] Applied to all values before they are cloned. If the
 *  nodeCallback returns a value other than undefined, the returned value is used instead of
 *  attempting to clone.
 * @return {Object} Copy of source object
 */
OO.copy = function ( source, leafCallback, nodeCallback ) {
	let destination;

	if ( nodeCallback ) {
		// Extensibility: check before attempting to clone source.
		destination = nodeCallback( source );
		if ( destination !== undefined ) {
			return destination;
		}
	}

	if ( Array.isArray( source ) ) {
		// Array (fall through)
		destination = new Array( source.length );
	} else if ( source && typeof source.clone === 'function' ) {
		// Duck type object with custom clone method
		return leafCallback ? leafCallback( source.clone() ) : source.clone();
	} else if ( source && typeof source.cloneNode === 'function' ) {
		// DOM Node
		return leafCallback ?
			leafCallback( source.cloneNode( true ) ) :
			source.cloneNode( true );
	} else if ( OO.isPlainObject( source ) ) {
		// Plain objects (fall through)
		destination = Object.create( Object.getPrototypeOf( source ) );
	} else {
		// Non-plain objects (incl. functions) and primitive values
		return leafCallback ? leafCallback( source ) : source;
	}

	// source is an array or a plain object
	for ( const key in source ) {
		destination[ key ] = OO.copy( source[ key ], leafCallback, nodeCallback );
	}

	// This is an internal node, so we don't apply the leafCallback.
	return destination;
};

/**
 * Generate a hash of an object based on its name and data.
 *
 * Performance optimization: <http://jsperf.com/ve-gethash-201208#/toJson_fnReplacerIfAoForElse>
 *
 * To avoid two objects with the same values generating different hashes, we utilize the replacer
 * argument of JSON.stringify and sort the object by key as it's being serialized. This may or may
 * not be the fastest way to do this; we should investigate this further.
 *
 * Objects and arrays are hashed recursively. When hashing an object that has a .getHash()
 * function, we call that function and use its return value rather than hashing the object
 * ourselves. This allows classes to define custom hashing.
 *
 * @memberof OO
 * @method getHash
 * @param {Object} val Object to generate hash for
 * @return {string} Hash of object
 */
OO.getHash = function ( val ) {
	return JSON.stringify( val, OO.getHash.keySortReplacer );
};

/**
 * Sort objects by key (helper function for {@link OO.getHash}).
 *
 * This is a callback passed into JSON.stringify.
 *
 * @memberof OO
 * @method getHash_keySortReplacer
 * @param {string} key Property name of value being replaced
 * @param {any} val Property value to replace
 * @return {any} Replacement value
 */
OO.getHash.keySortReplacer = function ( key, val ) {
	if ( val && typeof val.getHashObject === 'function' ) {
		// This object has its own custom hash function, use it
		val = val.getHashObject();
	}
	if ( !Array.isArray( val ) && Object( val ) === val ) {
		// Only normalize objects when the key-order is ambiguous
		// (e.g. any object not an array).
		const normalized = {};

		const keys = Object.keys( val ).sort();
		for ( let i = 0, len = keys.length; i < len; i++ ) {
			normalized[ keys[ i ] ] = val[ keys[ i ] ];
		}
		return normalized;
	} else {
		// Primitive values and arrays get stable hashes
		// by default. Lets those be stringified as-is.
		return val;
	}
};

/**
 * Get the unique values of an array, removing duplicates.
 *
 * @memberof OO
 * @method unique
 * @param {Array} arr Array
 * @return {Array} Unique values in array
 */
OO.unique = function ( arr ) {
	return Array.from( new Set( arr ) );
};

/**
 * Compute the union (duplicate-free merge) of a set of arrays.
 *
 * @memberof OO
 * @method simpleArrayUnion
 * @param {Array} a First array
 * @param {...Array} rest Arrays to union
 * @return {Array} Union of the arrays
 */
OO.simpleArrayUnion = function ( a, ...rest ) {
	const set = new Set( a );

	for ( let i = 0; i < rest.length; i++ ) {
		const arr = rest[ i ];
		for ( let j = 0; j < arr.length; j++ ) {
			set.add( arr[ j ] );
		}
	}

	return Array.from( set );
};

/**
 * Combine arrays (intersection or difference).
 *
 * An intersection checks the item exists in 'b' while difference checks it doesn't.
 *
 * @private
 * @memberof OO
 * @param {Array} a First array
 * @param {Array} b Second array
 * @param {boolean} includeB Whether to items in 'b'
 * @return {Array} Combination (intersection or difference) of arrays
 */
function simpleArrayCombine( a, b, includeB ) {
	const set = new Set( b );
	const result = [];

	for ( let j = 0; j < a.length; j++ ) {
		const isInB = set.has( a[ j ] );
		if ( isInB === includeB ) {
			result.push( a[ j ] );
		}
	}

	return result;
}

/**
 * Compute the intersection of two arrays (items in both arrays).
 *
 * @memberof OO
 * @method simpleArrayIntersection
 * @param {Array} a First array
 * @param {Array} b Second array
 * @return {Array} Intersection of arrays
 */
OO.simpleArrayIntersection = function ( a, b ) {
	return simpleArrayCombine( a, b, true );
};

/**
 * Compute the difference of two arrays (items in 'a' but not 'b').
 *
 * @memberof OO
 * @method simpleArrayDifference
 * @param {Array} a First array
 * @param {Array} b Second array
 * @return {Array} Intersection of arrays
 */
OO.simpleArrayDifference = function ( a, b ) {
	return simpleArrayCombine( a, b, false );
};
