import { ComponentHarness } from '@angular/cdk/testing';
import { DatePickerHarness } from '../shared/date-picker.harness';
import { byRole } from '../testing/by-role';

export class MealFilterHarness extends ComponentHarness {
  static hostSelector = 'wm-meal-filter';

  private _getStartEl = this.locatorFor(
    DatePickerHarness.with({ selector: byRole('start-date') })
  );

  private _getEndEl = this.locatorFor(
    DatePickerHarness.with({ selector: byRole('end-date') })
  );

  async setStartDate(date: Date) {
    const harness = await this._getStartEl();
    await harness.setDate(date);
  }

  async setEndDate(date: Date) {
    const harness = await this._getEndEl();
    await harness.setDate(date);
  }
}
