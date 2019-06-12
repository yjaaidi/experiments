class Cart {
    private _itemList: Item[] = [];

    addItem(item: Item) {
        this._itemList = [...this._itemList, item];
    }

    getItemList() {
        return this._itemList;
    }

    getTotalPrice() {
        return this._itemList.reduce((total, item) => total + item.price, 0);
    }
}

class Item {
    public name: string;

    public price: number;

    constructor({ name, price }: { name: string; price: number }) {
        this.price = price;
        this.name = name;
    }
}

describe('Cart', () => {
    let cart: Cart;
    let butter: Item;
    let hummus: Item;

    beforeEach(() => {
        cart = new Cart();
        butter = new Item({ name: 'Butter & Butter', price: 12 });
        hummus = new Item({ name: 'Hummus', price: 5 });
    });

    it('should add items', () => {
        cart.addItem(butter);
        cart.addItem(hummus);

        expect(cart.getItemList()).toEqual([butter, hummus]);
    });

    it('should get total price', () => {
        cart.addItem(butter);
        cart.addItem(hummus);

        expect(cart.getTotalPrice()).toEqual(17);
    });
});
