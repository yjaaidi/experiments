import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { byRole } from '../testing/by-role';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';

export class DatePickerHarness extends ComponentHarness {
  static hostSelector = 'wm-date-picker';

  static with({ selector }: { selector: string }) {
    return new HarnessPredicate(DatePickerHarness, { selector });
  }

  async setDate(date: Date) {
    const harness = await this.locatorFor(MatDatepickerInputHarness)();
    await harness.setValue(date.toISOString());
  }

  private async _setInputValue(selector: string, value: string) {
    const el = await this.locatorFor(selector)();
    await el.sendKeys(value);
  }
}
