import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { EasyHarness } from './../testing/easy-harness';

export class DatePickerHarness extends EasyHarness {
  static hostSelector = 'wm-date-picker';

  async setDate(date: Date) {
    const harness = await this.get(MatDatepickerInputHarness);
    await harness.setValue(date.toISOString());
  }
}
