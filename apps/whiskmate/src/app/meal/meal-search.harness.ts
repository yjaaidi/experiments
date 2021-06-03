import { ComponentHarness } from '@angular/cdk/testing';
import { MealFilterHarness, TestingMealFilter } from './meal-filter.harness';

export class MealSearchHarness extends ComponentHarness {
  static hostSelector = 'wm-meal-search';

  private _getFilterHarness = this.locatorFor(MealFilterHarness);

  async getMealCount() {
    return (await this.locatorForAll('wm-meal-preview')()).length;
  }

  async setFilter(filter: TestingMealFilter) {
    const harness = await this._getFilterHarness();
    await harness.setFilter(filter);
  }
}
