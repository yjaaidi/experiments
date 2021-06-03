import { EasyHarness } from './../testing/easy-harness';
import { MealFilterHarness, TestingMealFilter } from './meal-filter.harness';

export class MealSearchHarness extends EasyHarness {
  static hostSelector = 'wm-meal-search';

  async getMealCount() {
    return (await this.getAll('wm-meal-preview')).length;
  }

  async setFilter(filter: TestingMealFilter) {
    const harness = await this.get(MealFilterHarness);
    await harness.setFilter(filter);
  }
}
