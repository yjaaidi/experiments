import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { byRole } from '../testing/by-role';

export class DatePickerHarness extends ComponentHarness {
  static hostSelector = 'co-date-picker';

  static with({ selector }: { selector: string }) {
    return new HarnessPredicate(DatePickerHarness, { selector });
  }

  async setDate(date: Date) {
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();
    await this._setInputValue(byRole('day-input'), day);
    await this._setInputValue(byRole('month-input'), month);
    await this._setInputValue(byRole('year-input'), year);
  }

  private async _setInputValue(selector: string, value: string) {
    const el = await this.locatorFor(selector)();
    await el.sendKeys(value);
  }
}
