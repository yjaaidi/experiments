class Cart {
    private _itemList: Item[] = [];

    /**
     * @deprecated 🚧 Work in progress.
     */
    addItem(item: Item) {
        this._itemList = [...this._itemList, item];
    }

    /**
     * @deprecated 🚧 Work in progress.
     */
    getItemList() {
        return this._itemList;
    }
}

/**
 * @deprecated 🚧 Work in progress.
 */
class Item {
    constructor(public name: string, public price: number) {}
}

describe('Cart', () => {
    it('🚧 should add items', () => {
        const cart = new Cart();
        const burger = new Item('Burger', 12);
        const butter = new Item('Double Beurre', 5);
        cart.addItem(burger);
        cart.addItem(butter);
        const itemList = cart.getItemList();
        expect(itemList).toEqual([burger, butter]);
    });
});
