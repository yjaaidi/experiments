import { ComponentHarness } from '@angular/cdk/testing';
import { DatePickerHarness } from '../shared/date-picker.harness';
import { byRole } from '../testing/by-role';

export class MealFilterHarness extends ComponentHarness {
  static hostSelector = 'wm-meal-filter';

  async setFilter({ start, end }: TestingMealFilter) {
    if (start) await this._setStart(start);
    if (end) await this._setEnd(end);
  }

  async _setStart(date: Date) {
    const harness = await this._getDatePickerHarness(byRole('start-date'));
    await harness.setDate(date);
  }

  async _setEnd(date: Date) {
    const harness = await this._getDatePickerHarness(byRole('end-date'));
    await harness.setDate(date);
  }

  private async _getDatePickerHarness(selector: string) {
    return this.locatorFor(DatePickerHarness.with({ selector }))();
  }
}

/* Prefix with Testing to avoid collision with `MealFilter`. */
export interface TestingMealFilter {
  start?: Date;
  end?: Date;
}
