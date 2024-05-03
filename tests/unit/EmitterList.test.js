( function ( oo ) {

	// Define a test list object using the oo.EmitterList mixin
	function TestList() {
		// Mixin constructor
		oo.EventEmitter.call( this );
		oo.EmitterList.call( this );
	}
	oo.mixinClass( TestList, oo.EventEmitter );
	oo.mixinClass( TestList, oo.EmitterList );

	// Define a test item object
	function TestItem( content ) {
		// Mixin constructor
		oo.EventEmitter.call( this );

		this.content = content;
	}
	oo.mixinClass( TestItem, oo.EventEmitter );

	// Helper method to recognize items by their contents
	TestItem.prototype.getContent = function () {
		return this.content;
	};

	// Helper method to get an array of item contents for testing
	function getContentArray( arr ) {
		return arr.map( function ( item ) {
			if ( typeof item.getContent === 'function' ) {
				return item.getContent();
			}
			return JSON.stringify( item );
		} );
	}

	QUnit.module( 'EmitterList' );

	QUnit.test( 'addItems', function ( assert ) {
		const initialItems = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			],
			cases = [
				{
					items: initialItems,
					expected: [ 'a', 'b', 'c' ],
					msg: 'Inserting items in order'
				},
				{
					items: [],
					expected: [],
					msg: 'Inserting an empty array'
				},
				{
					items: [
						// 'a', 'b', 'c', 'a',
						initialItems[ 0 ],
						initialItems[ 1 ],
						initialItems[ 2 ],
						initialItems[ 0 ]
					],
					expected: [ 'b', 'c', 'a' ],
					msg: 'Moving duplicates when inserting a batch of items'
				},
				{
					items: initialItems,
					add: {
						items: [ initialItems[ 0 ] ],
						index: 2
					},
					expected: [ 'b', 'a', 'c' ],
					msg: 'Moving duplicates when re-inserting an item at a higher index'
				},
				{
					items: initialItems,
					add: {
						items: [ initialItems[ 2 ] ],
						index: 0
					},
					expected: [ 'c', 'a', 'b' ],
					msg: 'Moving duplicates when re-inserting an item at a lower index'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'd' )
						]
					},
					expected: [ 'a', 'b', 'c', 'd' ],
					msg: 'Inserting an item without index defaults to the end'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'd' )
						],
						index: 1
					},
					expected: [ 'a', 'd', 'b', 'c' ],
					msg: 'Inserting an item at a known index'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'd' )
						],
						index: 5
					},
					expected: [ 'a', 'b', 'c', 'd' ],
					msg: 'Inserting an item at an invalid index'
				},
				{
					items: initialItems,
					add: {
						items: [ {} ]
					},
					expected: [ 'a', 'b', 'c', '{}' ],
					msg: 'Inserting an object does not break everything.'
				}
			];

		cases.forEach( function ( test ) {
			const list = new TestList();
			list.addItems( test.items );

			if ( test.add ) {
				list.addItems( test.add.items, test.add.index );
			}

			assert.deepEqual( getContentArray( list.getItems() ), test.expected, test.msg );
		} );

		assert.throws( function () {
			const list = new TestList();
			list.addItems( initialItems.concat( [ null ] ) );
		}, 'throws when trying to add null item.' );

		assert.throws( function () {
			const list = new TestList();
			list.addItems( initialItems.concat( [ undefined ] ) );
		}, 'throws when trying to add undefined item.' );

		assert.throws( function () {
			const list = new TestList();
			list.addItems( initialItems.concat( [ 3 ] ) );
		}, 'throws when trying to add a number.' );
	} );

	QUnit.test( 'moveItem', function ( assert ) {
		const list = new TestList(),
			item = new TestItem( 'a' );
		assert.throws( function () {
			list.moveItem( item, 0 );
		}, 'Throw when trying to move an item not in the list' );
	} );

	QUnit.test( 'clearItems', function ( assert ) {
		const list = new TestList();

		list.addItems( [
			new TestItem( 'a' ),
			new TestItem( 'b' ),
			{ not: 'connectable' },
			new TestItem( 'c' )
		] );
		assert.strictEqual( list.getItemCount(), 4, 'Items added' );
		list.clearItems();
		assert.strictEqual( list.getItemCount(), 0, 'Items cleared' );
		assert.true( list.isEmpty(), 'List is empty' );
	} );

	QUnit.test( 'removeItems', function ( assert ) {
		const expected = [],
			list = new TestList(),
			plain = { not: 'connectable' },
			items = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			];

		list.addItems( items );
		assert.strictEqual( list.getItemCount(), 3, 'Items added' );

		list.removeItems( [ items[ 2 ] ] );
		assert.strictEqual( list.getItemCount(), 2, 'Item removed' );
		assert.strictEqual( list.getItemIndex( items[ 2 ] ), -1, 'The correct item was removed' );

		list.removeItems( [] );
		assert.strictEqual( list.getItemCount(), 2, 'Removing empty array of items does nothing' );

		// Remove an item with aggregate events
		list.aggregate( { change: 'itemChange' } );
		list.on( 'itemChange', function ( item ) {
			expected.push( item.getContent() );
		} );

		list.removeItems( items[ 0 ] );
		// 'a' - Should not be intercepted
		items[ 0 ].emit( 'change' );
		// 'b'
		items[ 1 ].emit( 'change' );
		assert.deepEqual( expected, [ 'b' ], 'Removing an item also removes its aggregate events' );

		// Item without connect() method
		list.addItems( [ plain ] );
		assert.strictEqual( list.getItemCount(), 2, 'Plain added' );
		list.removeItems( [ plain ] );
		assert.strictEqual( list.getItemCount(), 1, 'Plain removed' );
	} );

	QUnit.test( 'aggregate', function ( assert ) {
		const list = new TestList(),
			expectChange = [],
			expectEdit = [],
			plain = { not: 'connectable' },
			items = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			];

		list.addItems( items );

		list.aggregate( {
			change: 'itemChange',
			edit: 'itemEdit'
		} );
		list.on( 'itemChange', function ( item ) {
			expectChange.push( item.getContent() );
		} );
		list.on( 'itemEdit', function ( item ) {
			expectEdit.push( item.getContent() );
		} );

		// Change 'b'
		items[ 1 ].emit( 'change' );
		// Change 'a'
		items[ 0 ].emit( 'change' );
		// Edit 'c'
		items[ 2 ].emit( 'edit' );

		// Add an item after the fact
		const testItem = new TestItem( 'd' );
		list.addItems( testItem );
		testItem.emit( 'change' );

		// Remove aggregate event
		list.aggregate( { edit: null } );

		// Retry events
		items[ 1 ].emit( 'change' );
		// 'a' - Edit should not be aggregated
		items[ 0 ].emit( 'edit' );

		// Check that we have the desired result
		assert.deepEqual( expectChange, [ 'b', 'a', 'd', 'b' ], 'Change event aggregation intercepted in the correct order' );
		assert.deepEqual( expectEdit, [ 'c' ], 'Edit event aggregation intercepted in the correct order' );

		// Verify that aggregating duplicate events throws an exception
		assert.throws( function () {
			list.aggregate( { change: 'itemChangeDuplicate' } );
		}, 'Duplicate event aggregation throws an error' );

		// Items without connect() method are ignored
		list.addItems( plain );
		list.aggregate( { spain: 'onThePlain' } );
		list.aggregate( { spain: null } );
	} );

	QUnit.test( 'Events', function ( assert ) {
		const result = [],
			list = new TestList(),
			items = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			],
			stringifyEvent = function ( type, item, index ) {
				let string = type;
				if ( item ) {
					string += ':' + item.getContent();
				}
				if ( index !== undefined ) {
					string += '#' + index;
				}
				return string;
			};

		// Register
		list.on( 'add', function ( item, index ) {
			result.push( stringifyEvent( 'add', item, index ) );
		} );
		list.on( 'move', function ( item, index ) {
			result.push( stringifyEvent( 'move', item, index ) );
		} );
		list.on( 'remove', function ( item, index ) {
			result.push( stringifyEvent( 'remove', item, index ) );
		} );
		list.on( 'clear', function () {
			result.push( stringifyEvent( 'clear' ) );
		} );

		// Trigger events
		list.addItems( items );
		// Move the item; Bad index on purpose
		list.addItems( [ items[ 0 ] ], 10 );
		list.removeItems( items[ 1 ] );
		// Add array with a null item, should not result in an event.
		assert.throws( function () {
			list.addItems( [ null ] );
		}, 'throw when adding items array with null content' );

		// Nonexistent item
		list.removeItems( new TestItem( 'd' ) );
		list.clearItems();

		assert.deepEqual( result, [
			// addItems
			'add:a#0',
			'add:b#1',
			'add:c#2',
			// moveItems
			'move:a#2',
			// removeItems
			'remove:b#0',
			// clearItems
			'clear'
		], 'Correct events were emitted' );
	} );

}( OO ) );
