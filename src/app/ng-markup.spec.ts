import { ngMarkup } from './ng-markup';

it('should work', () => {

    const componentType = {
        ngComponentDef: {
            selectors: [
                [
                    'wt-child'
                ]
            ]
        }
    };

    const directiveType = {
        ngDirectiveDef: {
            selectors: [
                [
                    '',
                    '[noop]'
                ]
            ]
        }
    };

    const pipeType = {
        ngPipeDef: {
            name: 'up'
        }
    }

    expect(ngMarkup`
    <${componentType} ${directiveType}>
        {{ name | ${pipeType} }}
    </${componentType}>
    `).toEqual(`
    <wt-child noop>
        {{ name | up }}
    </wt-child>
    `);

});
