/**
 * Manage a sorted list of OO.EmitterList objects.
 *
 * The sort order is based on a callback that compares two items. The return value of
 * callback( a, b ) must be less than zero if a < b, greater than zero if a > b, and zero
 * if a is equal to b. The callback should only return zero if the two objects are
 * considered equal.
 *
 * When an item changes in a way that could affect their sorting behavior, it must
 * emit the {@link OO.SortedEmitterList#event:itemSortChange itemSortChange} event.
 * This will cause it to be re-sorted automatically.
 *
 * This mixin must be used in a class that also mixes in {@link OO.EventEmitter}.
 *
 * @abstract
 * @class
 * @mixes OO.EmitterList
 * @param {Function} sortingCallback Callback that compares two items.
 */
OO.SortedEmitterList = function OoSortedEmitterList( sortingCallback ) {
	// Mixin constructors
	OO.EmitterList.call( this );

	this.sortingCallback = sortingCallback;

	// Listen to sortChange event and make sure
	// we re-sort the changed item when that happens
	this.aggregate( {
		sortChange: 'itemSortChange'
	} );

	this.connect( this, {
		itemSortChange: 'onItemSortChange'
	} );
};

OO.mixinClass( OO.SortedEmitterList, OO.EmitterList );

/* Events */

/**
 * An item has changed properties that affect its sort positioning
 * inside the list.
 *
 * @private
 * @event OO.SortedEmitterList#itemSortChange
 */

/* Methods */

/**
 * Handle a case where an item changed a property that relates
 * to its sorted order.
 *
 * @param {OO.EventEmitter} item Item in the list
 */
OO.SortedEmitterList.prototype.onItemSortChange = function ( item ) {
	// Remove the item
	this.removeItems( item );
	// Re-add the item so it is in the correct place
	this.addItems( item );
};

/**
 * Change the sorting callback for this sorted list.
 *
 * The callback receives two items. The return value of callback(a, b) must be less than zero
 * if a < b, greater than zero if a > b, and zero if a is equal to b.
 *
 * @param {Function} sortingCallback Sorting callback
 */
OO.SortedEmitterList.prototype.setSortingCallback = function ( sortingCallback ) {
	const items = this.getItems();

	this.sortingCallback = sortingCallback;

	// Empty the list
	this.clearItems();
	// Re-add the items in the new order
	this.addItems( items );
};

/**
 * Add items to the sorted list.
 *
 * @param {OO.EventEmitter|OO.EventEmitter[]} items Item to add or
 *  an array of items to add
 * @return {OO.SortedEmitterList}
 */
OO.SortedEmitterList.prototype.addItems = function ( items ) {
	if ( !Array.isArray( items ) ) {
		items = [ items ];
	}

	if ( items.length === 0 ) {
		return this;
	}

	for ( let i = 0; i < items.length; i++ ) {
		// Find insertion index
		const insertionIndex = this.findInsertionIndex( items[ i ] );

		// Check if the item exists using the sorting callback
		// and remove it first if it exists
		if (
			// First make sure the insertion index is not at the end
			// of the list (which means it does not point to any actual
			// items)
			insertionIndex <= this.items.length &&
			// Make sure there actually is an item in this index
			this.items[ insertionIndex ] &&
			// The callback returns 0 if the items are equal
			this.sortingCallback( this.items[ insertionIndex ], items[ i ] ) === 0
		) {
			// Remove the existing item
			this.removeItems( this.items[ insertionIndex ] );
		}

		// Insert item at the insertion index
		const index = this.insertItem( items[ i ], insertionIndex );
		this.emit( 'add', items[ i ], index );
	}

	return this;
};

/**
 * Find the index a given item should be inserted at. If the item is already
 * in the list, this will return the index where the item currently is.
 *
 * @param {OO.EventEmitter} item Items to insert
 * @return {number} The index the item should be inserted at
 */
OO.SortedEmitterList.prototype.findInsertionIndex = function ( item ) {
	const list = this;

	return OO.binarySearch(
		this.items,
		// Fake a this.sortingCallback.bind( null, item ) call here
		// otherwise this doesn't pass tests in phantomJS
		function ( otherItem ) {
			return list.sortingCallback( item, otherItem );
		},
		true
	);

};
