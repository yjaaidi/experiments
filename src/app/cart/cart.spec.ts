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
            (total, item) => total + item.price.amount,
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
    /**
     * @deprecated Use {@link Item.price} instead.
     */
    priceAmount: number;
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
        this.price = price || { amount: priceAmount, currency: 'EUR' };
        this.priceAmount = this.price.amount;
        this.name = name;
    }
}

describe('Cart', () => {
    let cart: Cart;
    let butter: Item;
    let hummus: Item;

    beforeEach(() => {
        cart = new Cart();
        butter = new Item({
            name: 'Butter & Butter',
            price: {
                amount: 12,
                currency: 'EUR'
            }
        });
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
