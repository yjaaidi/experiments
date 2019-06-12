class Cart {
    private _itemList: Item[] = [];

    addItem(item: Item) {
        this._itemList = [...this._itemList, item];
    }

    getItemList() {
        return this._itemList;
    }
}

class Item {
    constructor(public name: string, public price: number) {}
}

describe('Cart', () => {
    it('should add items', () => {
        const cart = new Cart();
        const hummus = new Item('Hummus', 5);
        const shaskshouka = new Item('Shakshouka', 10);
        cart.addItem(hummus);
        cart.addItem(shaskshouka);
        const itemList = cart.getItemList();
        expect(itemList).toEqual([hummus, shaskshouka]);
    });

    it.todo('should get total price');
});
