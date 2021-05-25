import { ComponentHarness } from '@angular/cdk/testing';
import { MealFilterHarness } from './meal-filter.harness';

export class MealSearchHarness extends ComponentHarness {
  static hostSelector = 'co-meal-search';

  getFilterHarness = this.locatorFor(MealFilterHarness);

  async getMealCount() {
    return (await this.locatorForAll('co-meal-preview')()).length;
  }
}
