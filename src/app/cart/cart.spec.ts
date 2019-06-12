describe('Cart', () => {
    xit('🚧 should add items', () => {
        const cart = new Cart();
        const hummus = new Item('Hummus', 5);
        const shaskshouka = new Item('Shakshouka', 10);
        // @todo add items
        const itemList = cart.getItemList();
        expect(itemList).toEqual([hummus, shaskshouka]);
    });

    it.todo('should get total price');
});
