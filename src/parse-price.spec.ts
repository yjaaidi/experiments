
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
    throw new Error('😱 Not implemented yet!');
}

describe('parsePrice', () => {

    xit('should parse price without currency', () => {

        expect(parsePrice('12.12')).toEqual({
            coefficient: 1212,
            exponent: -2,
            currency: null
        });

    });

});
