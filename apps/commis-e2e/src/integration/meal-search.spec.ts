import { getHarness } from '@jscutlery/cypress-harness';
import { MealSearchHarness } from '../../../commis/src/app/meal/meal-search.harness';

describe('meal-search', () => {
  const harness = getHarness(MealSearchHarness);
  beforeEach(() => cy.visit('/'));

  it('should show all meals', () => {
    harness.getMealCount().should('equal', 5);
  });

  it('should filter meals', () => {
    harness.getFilterHarness().setStartDate(new Date(2021, 5, 2));

    harness.getFilterHarness().setEndDate(new Date(2021, 5, 4));

    harness.getMealCount().should('equal', 3);
  });
});
