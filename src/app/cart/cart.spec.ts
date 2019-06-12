class Cart {
    /**
     * @deprecated 🚧 Work in progress.
     */
    addItem(item: Item) {
        throw new Error('🚧 work in progress!');
    }

    /**
     * @deprecated 🚧 Work in progress.
     */
    getItemList() {
        throw new Error('🚧 work in progress!');
    }
}

class Item {
    constructor(public name: string, public price: number) {}
}

describe('Cart', () => {
    xit('🚧 should add items', () => {
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
