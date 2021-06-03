import { DatePickerHarness } from '../shared/date-picker.harness';
import { byRole } from '../testing/by-role';
import { EasyHarness } from './../testing/easy-harness';

export class MealFilterHarness extends EasyHarness {
  static hostSelector = 'wm-meal-filter';

  async setFilter({ start, end }: TestingMealFilter) {
    if (start) await this._setStart(start);
    if (end) await this._setEnd(end);
  }

  async _setStart(date: Date) {
    const harness = await this.get(DatePickerHarness, {
      selector: byRole('start-date'),
    });
    await harness.setDate(date);
  }

  async _setEnd(date: Date) {
    const harness = await this.get(DatePickerHarness, {
      selector: byRole('end-date'),
    });
    await harness.setDate(date);
  }
}

/* Prefix with Testing to avoid collision with `MealFilter`. */
export interface TestingMealFilter {
  start?: Date;
  end?: Date;
}
