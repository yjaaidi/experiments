import { getHarness } from '@jscutlery/cypress-harness';
import { MealSearchHarness } from '../../../whiskmate/src/app/meal/meal-search.harness';

describe('meal-search', () => {
  const harness = getHarness(MealSearchHarness);
  beforeEach(() => cy.visit('/'));

  it('should show all meals', () => {
    harness.getMealCount().should('equal', 5);
  });

  it('should filter meals', () => {
    harness.setFilter({
      start: new Date(2021, 5, 2),
      end: new Date(2021, 5, 4),
    });

    harness.getMealCount().should('equal', 3);
  });
});
