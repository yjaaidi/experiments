
interface Price {
    coefficient: number;
    exponent: number;
    currency: string;
}

/**
 * @deprecated wip
 * @param priceString
 */
function parsePrice(priceString: string): Price {
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

    });

    xit('should parse price with currency', () => {
        // @TODO: 12.12EUR => {coefficient: 1212, exponent: -2, currency: 'EUR'}
    });

    xit('should parse price with currency symbol', () => {
        // @TODO: 12.12€ => {coefficient: 1212, exponent: -2, currency: 'EUR'}
    });

});
