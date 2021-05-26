import { MealSearchComponent, MealSearchModule } from './meal-search.component';
import { mount } from '@jscutlery/cypress-angular/mount';
import { getHarness } from '@jscutlery/cypress-harness';
import { MealSearchHarness } from './meal-search.harness';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe(MealSearchComponent.name, () => {
  const harness = getHarness(MealSearchHarness);

  beforeEach(() =>
    mount(MealSearchComponent, {
      imports: [BrowserAnimationsModule, MealSearchModule],
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      style: require('!!css-loader!../../styles.css').toString(),
    })
  );

  it('should show all meals', () => {
    harness.getMealCount().should('equal', 5);
  });

  it('should filter meals', () => {
    harness.getFilterHarness().setStartDate(new Date(2021, 5, 2));

    harness.getFilterHarness().setEndDate(new Date(2021, 5, 4));

    harness.getMealCount().should('equal', 3);
  });
});
