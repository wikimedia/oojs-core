( function ( oo, global ) {

	QUnit.module( 'core' );

	QUnit.test( 'initClass', ( assert ) => {
		function Foo() {
		}
		oo.initClass( Foo );

		assert.deepEqual( Foo.static, {}, 'A "static" property (empty object) is created' );
	} );

	QUnit.test( 'inheritClass', ( assert ) => {
		function InitA() {}
		function InitB() {}
		oo.inheritClass( InitB, InitA );

		assert.deepEqual( InitA.static, {}, 'initialise static of parent class' );
		assert.deepEqual( InitB.static, {}, 'initialise static of child class' );
		assert.notStrictEqual( InitA.static, InitB.static, 'static container is unique' );

		function Base() {
			this.instanceA = 'Base';
			this.instanceB = 'Base';
		}
		oo.initClass( Base );
		Base.static.stat = 'Base';
		Base.prototype.protoA = 'Base';
		Base.prototype.protoB = function () {
			return 'Base';
		};
		Base.prototype.protoC = function () {
			return 'Base';
		};
		const base = new Base();

		function Child() {
			Child.super.call( this );
			this.instanceB = 'Child';
			this.instanceC = 'Child';
		}
		oo.inheritClass( Child, Base );
		Child.prototype.protoC = function () {
			return 'Child';
		};
		const child = new Child();

		assert.true( base instanceof Object, 'base instance of Object' );
		assert.true( base instanceof Base, 'base instance of Base' );
		assert.false( base instanceof Child, 'base not instance of Child' );
		assert.true( child instanceof Object, 'base instance of Object' );
		assert.true( child instanceof Base, 'base instance of Base' );
		assert.true( child instanceof Child, 'base instance of Child' );

		assert.strictEqual( Child.static.stat, 'Base', 'inherit static' );

		Child.static.stat = 'Child';

		assert.strictEqual( Base.static.stat, 'Base', 'Change to Child static does not affect Base' );

		assert.strictEqual( base.constructor, Base, 'preserve Base constructor property' );
		assert.strictEqual( base.instanceA, 'Base', 'constructor function ran' );
		assert.strictEqual( base.instanceC, undefined, 'child constructor did not run' );

		assert.strictEqual( child.constructor, Child, 'preserve Child constructor property' );
		assert.strictEqual( Child.super, Base, 'super property refers to parent class' );
		assert.strictEqual( Child.parent, Base, 'parent property refers to parent class (deprecated)' );
		assert.strictEqual( child.instanceA, 'Base', 'parent constructor ran' );
		assert.strictEqual( child.instanceB, 'Child', 'original constructor ran after parent' );
		assert.strictEqual( child.instanceC, 'Child', 'original constructor ran' );
		assert.strictEqual( child.protoB(), 'Base', 'inherit parent prototype (function value)' );
		assert.strictEqual( child.protoA, 'Base', 'inherit parent prototype (non-function value)' );
		assert.strictEqual( child.protoC(), 'Child', 'own properties go first' );

		assert.throws( () => {
			oo.inheritClass( Child, Base );
		}, 'Throw if target already inherits from source (from an earlier call)' );

		assert.throws( () => {
			oo.inheritClass( Child, Object );
		}, 'Throw if target already inherits from source (naturally, Object)' );

		assert.throws( () => {
			oo.inheritClass( Child, undefined );
		}, /Origin is not a function/, 'Throw if source is undefined (e.g. due to missing dependency)' );

		const enumKeys = [];
		for ( const key in child ) {
			enumKeys.push( key );
		}

		assert.strictEqual(
			enumKeys.indexOf( 'constructor' ),
			-1,
			'The restored "constructor" property should not be enumerable'
		);

		Base.prototype.protoD = function () {
			return 'Base';
		};
		Child.prototype.protoB = function () {
			return 'Child';
		};

		assert.strictEqual( child.protoD(), 'Base', 'inheritance is live (adding a new method deeper in the chain)' );
		assert.strictEqual( child.protoB(), 'Child', 'inheritance is live (overwriting an inherited method)' );
	} );

	QUnit.test( 'mixinClass', ( assert ) => {
		function Init() {}
		function Init2() {}
		OO.mixinClass( Init2, Init );

		assert.deepEqual( Init.static, {}, 'initialise static of parent class' );
		assert.deepEqual( Init2.static, {}, 'initialise static of child class' );

		function Base() {}
		oo.initClass( Base );
		Base.static.stat = 'Base';
		Base.prototype.protoFunction = function () {
			return 'Base';
		};

		function Mixin() {}
		oo.initClass( Mixin );

		function Child() {}
		oo.inheritClass( Child, Base );
		oo.mixinClass( Child, Mixin );
		Child.static.stat2 = 'Child';
		Child.prototype.protoFunction2 = function () {
			return 'Child';
		};

		function Mixer() {}
		oo.mixinClass( Mixer, Child );

		assert.strictEqual(
			Mixer.prototype.protoFunction,
			undefined,
			'mixin does not copy inherited prototype'
		);

		assert.strictEqual(
			Mixer.static.stat,
			undefined,
			'mixin does not copy inherited static'
		);

		assert.strictEqual(
			Mixer.prototype.constructor,
			Mixer,
			'mixin preserves constructor property'
		);

		assert.strictEqual(
			Object.prototype.hasOwnProperty.call( Mixer.prototype, 'protoFunction2' ),
			true,
			'mixin copies method'
		);

		assert.strictEqual(
			Object.prototype.hasOwnProperty.call( Mixer.static, 'stat2' ),
			true,
			'mixin copies static member'
		);

		const obj = new Mixer();

		assert.strictEqual( obj.protoFunction2(), 'Child', 'method works as expected' );

		assert.throws( () => {
			oo.mixinClass( Mixer, undefined );
		}, /Origin is not a function/, 'Throw if source is undefined (e.g. due to missing dependency)' );
	} );

	QUnit.test( 'isSubclass', ( assert ) => {
		function Base() {}
		function Child() {}
		function GrandChild() {}
		function Unrelated() {}
		oo.initClass( Base );
		oo.inheritClass( Child, Base );
		oo.inheritClass( GrandChild, Child );
		oo.initClass( Unrelated );
		assert.strictEqual( oo.isSubclass( Base, Object ), true, 'Base is subclass of Object' );
		assert.strictEqual( oo.isSubclass( Base, Base ), true, 'Base is subclass of Base' );
		assert.strictEqual( oo.isSubclass( Base, Child ), false, 'Base not subclass of Child' );
		assert.strictEqual( oo.isSubclass( Base, GrandChild ), false, 'Base not subclass of GrandChild' );

		assert.strictEqual( oo.isSubclass( GrandChild, Base ), true, 'GrandChild is subclass of Base' );
		assert.strictEqual( oo.isSubclass( GrandChild, Child ), true, 'GrandChild is subclass of Child' );
		assert.strictEqual( oo.isSubclass( GrandChild, GrandChild ), true, 'GrandChild is subclass of GrandChild' );
		assert.strictEqual( oo.isSubclass( Unrelated, Base ), false, 'Unrelated not subclass of Base' );
	} );

	( function () {
		const runners = {};

		runners.testGetProp = function ( type, obj ) {
			QUnit.test( 'getProp( ' + type + ' )', ( assert ) => {
				assert.strictEqual(
					oo.getProp( obj, 'foo' ),
					3,
					'single key'
				);
				assert.deepEqual(
					oo.getProp( obj, 'bar' ),
					{ baz: null, quux: { whee: 'yay' } },
					'single key, returns object'
				);
				assert.strictEqual(
					oo.getProp( obj, 'bar', 'baz' ),
					null,
					'two keys, returns null'
				);
				assert.strictEqual(
					oo.getProp( obj, 'bar', 'quux', 'whee' ),
					'yay',
					'three keys'
				);
				assert.strictEqual(
					oo.getProp( obj, 'x' ),
					undefined,
					'missing property returns undefined'
				);
				assert.strictEqual(
					oo.getProp( obj, 'foo', 'bar' ),
					undefined,
					'missing 2nd-level property returns undefined'
				);
				assert.strictEqual(
					oo.getProp( obj, 'foo', 'bar', 'baz', 'quux', 'whee' ),
					undefined,
					'multiple missing properties don\'t cause an error'
				);
				assert.strictEqual(
					oo.getProp( obj, 'bar', 'baz', 'quux' ),
					undefined,
					'accessing property of null returns undefined, doesn\'t cause an error'
				);
				assert.strictEqual(
					oo.getProp( obj, 'bar', 'baz', 'quux', 'whee', 'yay' ),
					undefined,
					'accessing multiple properties of null'
				);
			} );
		};

		runners.testSetProp = function ( type, obj ) {
			QUnit.test( 'setProp( ' + type + ' )', ( assert ) => {
				const emptyObj = {};

				oo.setProp( emptyObj );
				assert.deepEqual( emptyObj, {}, 'setting with insufficient arguments is a no-op' );

				oo.setProp( obj, 'foo', 4 );
				assert.strictEqual( obj.foo, 4, 'setting an existing key with depth 1' );

				oo.setProp( obj, 'test', 'TEST' );
				assert.strictEqual( obj.test, 'TEST', 'setting a new key with depth 1' );

				oo.setProp( obj, 'bar', 'quux', 'whee', 'YAY' );
				assert.strictEqual( obj.bar.quux.whee, 'YAY', 'setting an existing key with depth 3' );

				oo.setProp( obj, 'bar', 'a', 'b', 'c' );
				assert.strictEqual( obj.bar.a.b, 'c', 'setting two new keys within an existing key' );

				oo.setProp( obj, 'a', 'b', 'c', 'd', 'e', 'f' );
				assert.strictEqual( obj.a.b.c.d.e, 'f', 'setting new keys with depth 5' );

				oo.setProp( obj, 'bar', 'baz', 'whee', 'wheee', 'wheeee' );
				assert.strictEqual( obj.bar.baz, null, 'descending into null fails silently' );

				oo.setProp( obj, 'foo', 'bar', 5 );
				assert.strictEqual( obj.foo, 4, 'descending into primitive (number) preserves fails silently' );
			} );
		};

		runners.testDeleteProp = function ( type, obj ) {
			QUnit.test( 'deleteProp( ' + type + ' )', ( assert ) => {
				const clone = OO.copy( obj ),
					hasOwn = Object.prototype.hasOwnProperty;

				oo.deleteProp( clone );
				assert.deepEqual( clone, obj, 'deleting with insufficient arguments is a no-op' );

				oo.deleteProp( obj, 'foo' );
				assert.strictEqual( hasOwn.call( obj, 'foo' ), false, 'deleting an existing key with depth 1' );
				oo.setProp( obj, 'foo', 3 );

				oo.deleteProp( obj, 'test' );
				assert.strictEqual( hasOwn.call( obj, 'test' ), false, 'deleting an non-exsiting key is a silent no-op' );

				oo.deleteProp( obj, 'bar', 'quux', 'whee' );
				assert.strictEqual( hasOwn.call( obj.bar, 'quux' ), false, 'deleting an existing key with depth 3 cleans up empty object' );
				// Reset
				oo.setProp( obj, 'bar', 'quux', 'whee', 'yay' );

				oo.deleteProp( obj, 'bar', 'baz' );
				oo.deleteProp( obj, 'bar', 'quux', 'whee' );
				assert.strictEqual( hasOwn.call( obj, 'bar' ), false, 'deleting an existing key causes two cleanups' );

				oo.deleteProp( obj, 'foo', 'bar' );
				assert.strictEqual( hasOwn.call( obj, 'foo' ), true, 'descending into primitive (number) preserves fails silently' );

				// Remove siblings
				oo.deleteProp( obj, 'foo' );
				oo.deleteProp( obj, 'bar', 'baz' );
				// Reset
				oo.setProp( obj, 'bar', 'quux', 'whee', 'yay' );
				oo.deleteProp( obj.bar, 'quux', 'whee' );
				assert.strictEqual( hasOwn.call( obj, 'bar' ), true, 'empty object not deleted if not part of the arguments list' );

			} );
		};

		for ( const method in runners ) {
			const plainObj = {
				foo: 3,
				bar: {
					baz: null,
					quux: {
						whee: 'yay'
					}
				}
			};
			const funcObj = function abc( d ) {
				return d;
			};
			funcObj.foo = 3;
			funcObj.bar = {
				baz: null,
				quux: {
					whee: 'yay'
				}
			};
			const arrObj = [ 'a', 'b', 'c' ];
			arrObj.foo = 3;
			arrObj.bar = {
				baz: null,
				quux: {
					whee: 'yay'
				}
			};

			runners[ method ]( 'Object', plainObj );
			runners[ method ]( 'Function', funcObj );
			runners[ method ]( 'Array', arrObj );
		}
	}() );

	QUnit.test( 'cloneObject', ( assert ) => {
		const hasOwn = Object.prototype.hasOwnProperty;

		function Foo( x ) {
			this.x = x;
		}
		Foo.prototype.x = 'default';
		Foo.prototype.aFn = function () {
			return 'proto of Foo';
		};

		const myfoo = new Foo( 10 );
		const myfooClone = oo.cloneObject( myfoo );

		assert.notStrictEqual( myfoo, myfooClone, 'clone is not equal when compared by reference' );
		assert.deepEqual( myfoo, myfooClone, 'clone is equal when recursively compared by value' );

		const expected = {
			x: 10,
			aFn: 'proto of Foo',
			constructor: Foo,
			instanceOf: true,
			own: {
				x: true,
				aFn: false,
				constructor: false
			}
		};

		assert.deepEqual(
			{
				x: myfoo.x,
				aFn: myfoo.aFn(),
				constructor: myfoo.constructor,
				instanceOf: myfoo instanceof Foo,
				own: {
					x: hasOwn.call( myfoo, 'x' ),
					aFn: hasOwn.call( myfoo, 'aFn' ),
					constructor: hasOwn.call( myfoo, 'constructor' )
				}
			},
			expected,
			'original looks as expected'
		);

		assert.deepEqual(
			{
				x: myfooClone.x,
				aFn: myfooClone.aFn(),
				constructor: myfooClone.constructor,
				instanceOf: myfooClone instanceof Foo,
				own: {
					x: hasOwn.call( myfooClone, 'x' ),
					aFn: hasOwn.call( myfooClone, 'aFn' ),
					constructor: hasOwn.call( myfoo, 'constructor' )
				}
			},
			expected,
			'clone looks as expected'
		);

	} );

	QUnit.test( 'getObjectValues', ( assert ) => {
		assert.deepEqual(
			oo.getObjectValues( { a: 1, b: false, foo: 'bar' } ),
			[ 1, false, 'bar' ],
			'Plain object with primitive values'
		);
		assert.deepEqual(
			oo.getObjectValues( [ 1, false, 'bar' ] ),
			[ 1, false, 'bar' ],
			'Array with primitive values'
		);

		const tmpFunc = function () {
			this.isTest = true;

			return this;
		};
		tmpFunc.a = 1;
		tmpFunc.b = false;
		tmpFunc.foo = 'bar';

		assert.deepEqual(
			oo.getObjectValues( tmpFunc ),
			[ 1, false, 'bar' ],
			'Function with properties'
		);

		const tmpObj = Object.create( { a: 1, b: false, foo: 'bar' } );
		tmpObj.b = true;
		tmpObj.bar = 'quux';

		assert.deepEqual(
			oo.getObjectValues( tmpObj ),
			[ true, 'quux' ],
			'Only own properties'
		);

		assert.throws(
			() => {
				oo.getObjectValues( 'hello' );
			},
			/^TypeError/,
			'Throw exception for non-object (string)'
		);

		assert.throws(
			() => {
				oo.getObjectValues( null );
			},
			/^TypeError/,
			'Throw exception for non-object (null)'
		);
	} );

	QUnit.test( 'binarySearch', ( assert ) => {
		const data = [ -42, -10, 0, 2, 5, 7, 12, 21, 42, 70, 144, 1001 ];

		function dir( target, item ) {
			return target > item ? 1 : ( target < item ? -1 : 0 );
		}

		function assertSearch( target, expectedPath, expectedRet ) {
			const path = [];

			const ret = oo.binarySearch( data, ( item ) => {
				path.push( item );
				return dir( target, item );
			} );

			assert.deepEqual( path, expectedPath, 'Search ' + target );
			assert.strictEqual( ret, expectedRet, 'Search ' + target + ' (index)' );
		}

		assertSearch( 12, [ 12 ], 6 );
		assertSearch( -42, [ 12, 2, -10, -42 ], 0 );
		assertSearch( 42, [ 12, 70, 42 ], 8 );

		// Out of bounds
		assertSearch( -2000, [ 12, 2, -10, -42 ], null );
		assertSearch( 2000, [ 12, 70, 1001 ], null );

		assert.strictEqual(
			oo.binarySearch( data, ( item ) => dir( -2000, item ), true ),
			0,
			'forInsertion at start'
		);

		assert.strictEqual(
			oo.binarySearch( [ 1, 2, 4, 5 ], ( item ) => dir( 3, item ), true ),
			2,
			'forInsertion in the middle'
		);

		assert.strictEqual(
			oo.binarySearch( data, ( item ) => dir( 2000, item ), true ),
			12,
			'forInsertion at end'
		);

	} );

	QUnit.test( 'compare', ( assert ) => {
		assert.strictEqual(
			oo.compare( [], [] ),
			true,
			'Empty array'
		);

		assert.strictEqual(
			oo.compare( {}, {} ),
			true,
			'Empty plain object'
		);

		assert.strictEqual(
			oo.compare( {}, null ),
			true,
			'Empty plain object against null'
		);

		assert.strictEqual(
			oo.compare( {}, undefined ),
			true,
			'Empty plain object against undefined'
		);

		assert.strictEqual(
			oo.compare( null, {} ),
			true,
			'Null against empty plain object'
		);

		assert.strictEqual(
			oo.compare( [ 1, 2, undefined ], [ 1, 2 ] ),
			true,
			'Implicit undefined against explicit undefined'
		);

		assert.strictEqual(
			oo.compare( [], [ undefined ] ),
			true,
			'Implicit undefined against explicit undefined (empty array)'
		);

		assert.strictEqual(
			oo.compare( { a: 1 }, null ),
			false,
			'Plain object against null'
		);

		assert.strictEqual(
			oo.compare( { a: 1 }, undefined ),
			false,
			'Plain object against null'
		);

		assert.strictEqual(
			oo.compare( [ undefined ], [ undefined ] ),
			true,
			'Undefined in array'
		);

		assert.strictEqual(
			oo.compare( [ null ], [ null ] ),
			true,
			'Null in array'
		);

		assert.strictEqual(
			oo.compare( [ true ], [ true ] ),
			true,
			'boolean in array'
		);

		assert.strictEqual(
			oo.compare( [ true ], [ false ] ),
			false,
			'different booleans in array'
		);

		assert.strictEqual(
			oo.compare( [ 42 ], [ 42 ] ),
			true,
			'number in array'
		);

		assert.strictEqual(
			oo.compare( [ 42 ], [ 32 ] ),
			false,
			'different number in array'
		);

		assert.strictEqual(
			oo.compare( [ 'foo' ], [ 'foo' ] ),
			true,
			'string in array'
		);

		assert.strictEqual(
			oo.compare( [ 'foo' ], [ 'bar' ] ),
			false,
			'different string in array'
		);

		assert.strictEqual(
			oo.compare( [], {} ),
			true,
			'Empty array equals empty plain object'
		);

		assert.strictEqual(
			oo.compare( { a: 5 }, { a: 5, b: undefined } ),
			true,
			'Missing key and undefined are treated the same'
		);

		assert.strictEqual(
			oo.compare(
				{
					foo: [ true, 42 ],
					bar: [ {
						x: {},
						y: [ 'test' ]
					} ]
				},
				{
					foo: [ true, 42 ],
					bar: [ {
						x: {},
						y: [ 'test' ]
					} ]
				}
			),
			true,
			'Nested structure with no difference'
		);

		let x = { a: 1 };

		assert.strictEqual(
			oo.compare( x, x ),
			true,
			'Compare object to itself'
		);

		x = Object.create( { foo: 1, map: function () { } } );
		x.foo = 2;
		x.bar = true;

		assert.strictEqual(
			oo.compare( x, { foo: 2, bar: true } ),
			true,
			'Ignore inherited properties and methods of a'
		);

		assert.strictEqual(
			oo.compare( { foo: 2, bar: true }, x ),
			true,
			'Ignore inherited properties and methods of b'
		);

		assert.strictEqual(
			oo.compare(
				{
					foo: [ true, 42 ],
					bar: [ {
						x: {},
						y: [ 'test' ]
					} ]
				},
				{
					foo: [ 1, 42 ],
					bar: [ {
						x: {},
						y: [ 'test' ]
					} ]
				}
			),
			false,
			'Nested structure with difference'
		);

		// Give each function a different number of specified arguments to
		// also change the 'length' property of a function.

		x = function X( a ) {
			this.name = a || 'X';
		};
		x.foo = [ true ];

		const y = function Y( a, b ) {
			this.name = b || 'Y';
		};
		y.foo = [ true ];

		const z = function Z( a, b, c ) {
			this.name = c || 'Z';
		};
		z.foo = [ 1 ];

		// oo.compare ignores the function body. It treats them
		// like regular object containers.
		assert.strictEqual(
			oo.compare( x, y ),
			true,
			'Different functions with the same properties'
		);

		assert.strictEqual(
			oo.compare( x, z ),
			false,
			'Different functions with different properties'
		);
	} );

	QUnit.test( 'compare( Node, Node )', ( assert ) => {
		const a = {
			id: '1',
			nodeType: 0,
			isEqualNode: function ( other ) {
				return this.id === other.id;
			}
		};
		const b = {
			id: '2',
			nodeType: 0,
			isEqualNode: function ( other ) {
				return this.id === other.id;
			}
		};
		const c = {
			id: '2',
			nodeType: 0,
			isEqualNode: function ( other ) {
				return this.id === other.id;
			}
		};

		assert.strictEqual(
			oo.compare( a, a ),
			true,
			'same Node object'
		);
		assert.strictEqual(
			oo.compare( a, b ),
			false,
			'different Node (isEqualNode returns false)'
		);
		assert.strictEqual(
			oo.compare( b, c ),
			true,
			'equal Node (isEqualNode returns true)'
		);

		assert.strictEqual(
			oo.compare( { obj: a }, { obj: a } ),
			true,
			'(nested) same Node object'
		);
		assert.strictEqual(
			oo.compare( { obj: a }, { obj: b } ),
			false,
			'(nested) different Node (isEqualNode returns false)'
		);
		assert.strictEqual(
			oo.compare( { obj: b }, { obj: c } ),
			true,
			'(nested) equal Node (isEqualNode returns true)'
		);
	} );

	QUnit.test( 'compare( Object, Object, Boolean asymmetrical )', ( assert ) => {
		let x = {
			foo: [ true, 42 ],
			baz: undefined
		};
		let y = {
			foo: [ true, 42, 10 ],
			bar: [ {
				x: {},
				y: [ 'test' ]
			} ],
			baz: 1701
		};
		const z = {
			foo: [ 1, 42 ],
			bar: [ {
				x: {},
				y: [ 'test' ]
			} ],
			baz: 1701
		};

		assert.strictEqual(
			oo.compare( x, y, false ),
			false,
			'A subset of B (asymmetrical: false)'
		);

		assert.strictEqual(
			oo.compare( x, y, true ),
			true,
			'A subset of B (asymmetrical: true)'
		);

		assert.strictEqual(
			oo.compare( x, z, true ),
			false,
			'A subset of B with differences (asymmetrical: true)'
		);

		assert.strictEqual(
			oo.compare( [ undefined, 'val2' ], [ 'val1', 'val2', 'val3' ], true ),
			true,
			'A subset of B with sparse array'
		);

		x = null;
		y = null;
		const depth = 15;
		for ( let i = 0; i < depth; i++ ) {
			x = [ x, x ];
			y = [ y, y ];
		}
		const compare = oo.compare;
		try {
			oo.compare = function () {
				oo.compare.callCount += 1;
				return compare.apply( null, arguments );
			};
			oo.compare.callCount = 0;
			oo.compare( x, y );
			assert.strictEqual(
				oo.compare.callCount,
				Math.pow( 2, depth + 1 ) - 2,
				'Efficient depth recursion'
			);
		} finally {
			oo.compare = compare;
		}
	} );

	QUnit.test( 'copy( source )', ( assert ) => {
		const simpleObj = { foo: 'bar', baz: 3, quux: null, truth: true, falsehood: false },
			simpleArray = [ 'foo', 3, true, false ],
			withObj = [ { bar: 'baz', quux: 3 }, 5, null ],
			withArray = [ [ 'a', 'b' ], [ 1, 3, 4 ] ],
			sparseArray = [ 'a', undefined, undefined, 'b' ],
			withSparseArray = [ [ 'a', undefined, undefined, 'b' ] ],
			withFunction = [ function () {
				return true;
			} ],
			nodeLike = {
				cloneNode: function () {
					return 'cloned node';
				}
			};

		function Cloneable( name ) {
			this.name = name;
		}
		Cloneable.prototype.clone = function () {
			return new Cloneable( this.name + '-clone' );
		};

		function Thing( id ) {
			this.id = id;

			// Create a trap here to make sure we explode if
			// oo.copy tries to copy non-plain objects.
			this.child = {
				parent: this
			};
		}

		assert.deepEqual(
			oo.copy( simpleObj ),
			simpleObj,
			'Simple object'
		);

		assert.deepEqual(
			oo.copy( simpleArray ),
			simpleArray,
			'Simple array'
		);

		assert.deepEqual(
			oo.copy( withObj ),
			withObj,
			'Nested object'
		);

		assert.deepEqual(
			oo.copy( withArray ),
			withArray,
			'Nested array'
		);

		assert.deepEqual(
			oo.copy( sparseArray ),
			sparseArray,
			'Sparse array'
		);

		assert.deepEqual(
			oo.copy( withSparseArray ),
			withSparseArray,
			'Nested sparse array'
		);

		assert.deepEqual(
			oo.copy( withFunction ),
			withFunction,
			'Nested function'
		);

		assert.deepEqual(
			oo.copy( new Cloneable( 'bar' ) ),
			new Cloneable( 'bar-clone' ),
			'Cloneable object'
		);

		assert.deepEqual(
			oo.copy( { x: new Cloneable( 'bar' ) } ),
			{ x: new Cloneable( 'bar-clone' ) },
			'Nested Cloneable object'
		);

		assert.deepEqual(
			oo.copy( [ new Thing( 42 ) ] ),
			[ new Thing( 42 ) ]
		);

		assert.deepEqual(
			oo.copy( null ),
			null,
			'Copying null'
		);

		assert.deepEqual(
			oo.copy( undefined ),
			undefined,
			'Copying undefined'
		);

		assert.deepEqual(
			oo.copy( { a: null, b: undefined } ),
			{ a: null, b: undefined },
			'Copying objects with null and undefined fields'
		);

		assert.deepEqual(
			oo.copy( [ null, undefined ] ),
			[ null, undefined ],
			'Copying arrays with null and undefined elements'
		);

		assert.deepEqual(
			oo.copy( nodeLike ),
			'cloned node',
			'Node-like object (using #cloneNode)'
		);
	} );

	QUnit.test( 'copy( source, Function leafCallback )', ( assert ) => {
		const nodeLike = {
			cloneNode: function () {
				return 'cloned node';
			}
		};

		function Cloneable( name ) {
			this.name = name;
			this.clone = function () {
				return new Cloneable( this.name + '-clone' );
			};
		}

		assert.deepEqual(
			oo.copy(
				{ foo: 'bar', baz: [ 1 ], bat: null, bar: undefined },
				( val ) => 'mod-' + val
			),
			{ foo: 'mod-bar', baz: [ 'mod-1' ], bat: 'mod-null', bar: 'mod-undefined' },
			'Callback on primitive values'
		);

		assert.deepEqual(
			oo.copy(
				new Cloneable( 'callback' ),
				( val ) => {
					val.name += '-mod';
					return val;
				}
			),
			new Cloneable( 'callback-clone-mod' ),
			'Callback on cloneables (top-level)'
		);

		assert.deepEqual(
			oo.copy(
				[ new Cloneable( 'callback' ) ],
				( val ) => {
					val.name += '-mod';
					return val;
				}
			),
			[ new Cloneable( 'callback-clone-mod' ) ],
			'Callback on cloneables (as array elements)'
		);

		assert.deepEqual(
			oo.copy(
				nodeLike,
				( val ) => {
					val += ' leaf';
					return val;
				}
			),
			'cloned node leaf',
			'Node-like object'
		);
	} );

	QUnit.test( 'copy( source, Function leafCallback, Function nodeCallback )', ( assert ) => {
		function Cloneable( name ) {
			this.name = name;
			this.clone = function () {
				return new Cloneable( this.name + '-clone' );
			};
		}

		assert.deepEqual(
			oo.copy(
				{ foo: 'bar', baz: [ 1 ], bat: null, bar: undefined },
				( val ) => 'mod-' + val,
				( val ) => {
					if ( Array.isArray( val ) ) {
						return [ 2 ];
					}
					if ( val === undefined ) {
						return '!';
					}
				}
			),
			{ foo: 'mod-bar', baz: [ 2 ], bat: 'mod-null', bar: '!' },
			'Callback to override array clone'
		);

		assert.deepEqual(
			oo.copy(
				[
					new Cloneable( 'callback' ),
					new Cloneable( 'extension' )
				],
				( val ) => {
					val.name += '-mod';
					return val;
				},
				( val ) => {
					if ( val && val.name === 'extension' ) {
						return { type: 'extension' };
					}
				}
			),
			[ new Cloneable( 'callback-clone-mod' ), { type: 'extension' } ],
			'Extension callback overriding cloneables'
		);
	} );

	QUnit.test( 'getHash: Basic usage', ( assert ) => {
		const cases = {},
			hash = '{"a":1,"b":1,"c":1}',
			customHash = '{"first":1,"last":1}';

		cases[ 'a-z literal' ] = {
			object: {
				a: 1,
				b: 1,
				c: 1
			},
			hash: hash
		};

		cases[ 'z-a literal' ] = {
			object: {
				c: 1,
				b: 1,
				a: 1
			},
			hash: hash
		};

		const tmp1 = {};
		cases[ 'a-z augmented' ] = {
			object: tmp1,
			hash: hash
		};
		tmp1.a = 1;
		tmp1.b = 1;
		tmp1.c = 1;

		const tmp2 = {};
		cases[ 'z-a augmented' ] = {
			object: tmp2,
			hash: hash
		};
		tmp2.c = 1;
		tmp2.b = 1;
		tmp2.a = 1;

		cases[ 'custom hash' ] = {
			object: {
				getHashObject: function () {
					return {
						first: 1,
						last: 1
					};
				}
			},
			hash: customHash
		};

		cases[ 'custom hash reversed' ] = {
			object: {
				getHashObject: function () {
					return {
						last: 1,
						first: 1
					};
				}
			},
			hash: customHash
		};

		for ( const key in cases ) {
			assert.strictEqual(
				oo.getHash( cases[ key ].object ),
				cases[ key ].hash,
				key + ': object has expected hash, regardless of "property order"'
			);
		}

		// .. and that something completely different is in face different
		// (just incase getHash is broken and always returns the same)
		assert.notStrictEqual(
			oo.getHash( { a: 2, b: 2 } ),
			hash,
			'A different object has a different hash'
		);
	} );

	QUnit.test( 'getHash: Complex usage', ( assert ) => {
		const obj = {
			a: 1,
			b: 1,
			c: 1,
			// Nested array
			d: [ 'x', 'y', 'z' ],
			e: {
				a: 2,
				b: 2,
				c: 2
			}
		};

		assert.strictEqual(
			oo.getHash( obj ),
			'{"a":1,"b":1,"c":1,"d":["x","y","z"],"e":{"a":2,"b":2,"c":2}}',
			'Object with nested array and nested object'
		);

		// Include a circular reference
		/*
		 * PhantomJS hangs when calling JSON.stringify with an object containing a
		 * circular reference (https://github.com/ariya/phantomjs/issues/11206).
		 * We know latest Chrome/Firefox and IE 11 support this. So, for the sake of
		 * having qunit/phantomjs work, lets disable this for now.
		obj.f = obj;

		assert.throws( function () {
			oo.getHash( obj );
		}, 'Throw exceptions for objects with cirular references ' );
		*/

		function Foo() {
			this.a = 1;
			this.c = 3;
			this.b = 2;
		}

		const hash = '{"a":1,"b":2,"c":3}';

		assert.strictEqual(
			oo.getHash( new Foo() ),
			hash,
			// This was previously broken when we used .constructor === Object
			// oo.getHash.keySortReplacer, because although instances of Foo
			// do inherit from Object (( new Foo() ) instanceof Object === true),
			// direct comparison would return false.
			'Treat objects constructed by a function as well'
		);
	} );

	if ( global.document ) {
		QUnit.test( 'getHash( iframe Object )', ( assert ) => {
			const IframeObject = QUnit.tmpIframe().contentWindow.Object;
			const obj = new IframeObject();
			obj.c = 3;
			obj.b = 2;
			obj.a = 1;

			const hash = '{"a":1,"b":2,"c":3}';

			assert.strictEqual(
				oo.getHash( obj ),
				hash,
				// This was previously broken when we used comparison with "Object" in
				// oo.getHash.keySortReplacer, because they are an instance of the other
				// window's "Object".
				'Treat objects constructed by a another window as well'
			);
		} );
	}

	QUnit.test( 'unique', ( assert ) => {

		assert.deepEqual(
			oo.unique( [] ),
			[],
			'Empty'
		);

		assert.deepEqual(
			oo.unique( [ 'a', 'b', 'a' ] ),
			[ 'a', 'b' ],
			'Simple string duplication'
		);

		assert.deepEqual(
			oo.unique( [ 'o', 'o', 'j', 's' ] ),
			[ 'o', 'j', 's' ],
			'Simple string duplication'
		);

		assert.deepEqual(
			oo.unique( [ 3, 3, 2, 4, 3, 1, 2, 1, 1, 2 ] ),
			[ 3, 2, 4, 1 ],
			'Simple number duplication'
		);

		assert.deepEqual(
			oo.unique( [ 1, '1', 1, '1', { a: 1 }, { a: 1 } ] ),
			[ 1, '1', { a: 1 }, { a: 1 } ],
			'Strict equality de-duplication only'
		);

		const obj = {};
		assert.deepEqual(
			oo.unique( [ obj, obj ] ),
			[ obj ],
			'Object identity de-duplication'
		);

		assert.deepEqual(
			oo.unique( [ 1, 2, 3 ] ),
			[ 1, 2, 3 ],
			'No duplication'
		);

	} );

	QUnit.test( 'simpleArrayUnion', ( assert ) => {

		assert.deepEqual(
			oo.simpleArrayUnion( [] ),
			[],
			'Empty'
		);

		assert.deepEqual(
			oo.simpleArrayUnion( [ 'a', 'b', 'a' ] ),
			[ 'a', 'b' ],
			'Single array with dupes'
		);

		assert.deepEqual(
			oo.simpleArrayUnion( [ 'a', 'b', 'a' ], [ 'c', 'd', 'c' ] ),
			[ 'a', 'b', 'c', 'd' ],
			'Multiple arrays with their own dupes'
		);

		assert.deepEqual(
			oo.simpleArrayUnion( [ 'a', 'b', 'a', 'c' ], [ 'c', 'd', 'c', 'a' ] ),
			[ 'a', 'b', 'c', 'd' ],
			'Multiple arrays with mixed dupes'
		);

		assert.deepEqual(
			oo.simpleArrayUnion(
				[ 1, 2, 1, 2, true, { a: 1 } ],
				[ 3, 3, 2, 1, false, { b: 2 } ]
			),
			[ 1, 2, true, { a: 1 }, 3, false, { b: 2 } ],
			'Objects are supported'
		);

	} );

	QUnit.test( 'simpleArrayIntersection', ( assert ) => {

		assert.deepEqual(
			oo.simpleArrayIntersection( [], [] ),
			[],
			'Empty'
		);

		assert.deepEqual(
			oo.simpleArrayIntersection(
				[ 'a', 'b', 'c', 'a' ],
				[ 'b', 'c', 'd', 'c' ]
			),
			[ 'b', 'c' ],
			'Simple'
		);

	} );

	QUnit.test( 'simpleArrayDifference', ( assert ) => {

		assert.deepEqual(
			oo.simpleArrayDifference( [], [] ),
			[],
			'Empty'
		);

		assert.deepEqual(
			oo.simpleArrayDifference(
				[ 'a', 'b', 'c', 'a' ],
				[ 'b', 'c', 'd', 'c' ]
			),
			[ 'a', 'a' ],
			'Simple'
		);

	} );

}( OO, this ) );
