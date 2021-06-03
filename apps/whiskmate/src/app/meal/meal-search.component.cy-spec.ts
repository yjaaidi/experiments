import { mount } from '@jscutlery/cypress-angular/mount';
import { getHarness } from '@jscutlery/cypress-harness';
import { MealSearchComponent, MealSearchModule } from './meal-search.component';
import { MealSearchHarness } from './meal-search.harness';

describe(MealSearchComponent.name, () => {
  const harness = getHarness(MealSearchHarness);

  beforeEach(() =>
    mount(MealSearchComponent, {
      imports: [MealSearchModule],
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      style: require('!!css-loader!../../styles.css').toString(),
    })
  );

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
