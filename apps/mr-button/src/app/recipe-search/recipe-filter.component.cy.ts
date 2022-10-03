import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeFilterComponent } from './recipe-filter.component';

describe(RecipeFilterComponent.name, () => {
  it('should trigger filter change', () => {
    const { getFilterChangeSpy, setKeywords } = renderRecipePreview();

    setKeywords('Burger');

    getFilterChangeSpy().its('callCount').should('equal', 6);

    getFilterChangeSpy()
      .its('lastCall.args.0.keywords')
      .should('equal', 'Burger');
  });

  function renderRecipePreview() {
    const filterChangeSpy = cy.spy().as('filterChangeSpy');

    /* autoSpyOutputs doesn't work with any Observable.
     * It has to be an EventEmitter. */
    cy.mount(`<wm-recipe-filter (filterChange)="filterChangeSpy($event)">`, {
      imports: [BrowserAnimationsModule, RecipeFilterComponent],
      componentProperties: {
        filterChangeSpy,
      },
    });

    return {
      getFilterChangeSpy() {
        return cy.wrap(filterChangeSpy);
      },
      setKeywords(keywords: string) {
        cy.getByDataRole('keywords-input').type(keywords);
      },
    };
  }
});
