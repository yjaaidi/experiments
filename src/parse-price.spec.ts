/**
 * @deprecated wip
 * @param priceString
 */
function parsePrice(priceString: string) {

    return {
        coefficient: parseFloat(priceString) * 100,
        exponent: -2,
        currency: null
    };

}

describe('parsePrice', () => {

    it('should parse price without currency', () => {

        expect(parsePrice('12.12')).toEqual({
            coefficient: 1212,
            exponent: -2,
            currency: null
        });

        expect(parsePrice('12.99')).toEqual({
            coefficient: 1299,
            exponent: -2,
            currency: null
        });

    });

    xit('should parse price with currency code', () => {
        // @todo: parsePrice('12.12EUR') => {coefficient: 1212, exponent: -2, currency: 'EUR'}
    });

    xit('should parse price with currency symbol', () => {
        // @todo: parsePrice('12.12€') => {coefficient: 1212, exponent: -2, currency: 'EUR'}
    });

});
