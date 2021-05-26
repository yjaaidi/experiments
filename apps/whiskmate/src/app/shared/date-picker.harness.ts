import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { byRole } from '../testing/by-role';

export class DatePickerHarness extends ComponentHarness {
  static hostSelector = 'wm-date-picker';

  static with({ selector }: { selector: string }) {
    return new HarnessPredicate(DatePickerHarness, { selector });
  }

  async setDate(date: Date) {
    await this._setInputValue(byRole('date-input'), date.toISOString().split('T')[0])
  }

  private async _setInputValue(selector: string, value: string) {
    const el = await this.locatorFor(selector)();
    await el.sendKeys(value);
  }
}
