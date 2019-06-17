class Cart {
    private _itemList: Item[] = [];

    addItem(item: Item) {
        this._itemList = [...this._itemList, item];
    }

    getItemList() {
        return this._itemList;
    }

    getTotalPrice() {
        return this._itemList.reduce(
            (total, item) => total + item.priceAmount,
            0
        );
    }
}

interface Price {
    amount: number;
    currency: string;
}

class Item {
    name: string;
    priceAmount: number;
    /**
     * @deprecated 🚧 Work in progress.
     */
    price: Price;

    constructor({
        name,
        price,
        priceAmount
    }: {
        name: string;
        price?: Price;
        priceAmount?: number;
    }) {
        this.priceAmount = priceAmount;
        this.price = price || { amount: priceAmount, currency: 'EUR' };
        this.name = name;
    }
}

describe('Cart', () => {
    let cart: Cart;
    let butter: Item;
    let hummus: Item;

    beforeEach(() => {
        cart = new Cart();
        butter = new Item({ name: 'Butter & Butter', priceAmount: 12 });
        hummus = new Item({ name: 'Hummus', priceAmount: 5 });
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
