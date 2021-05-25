import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import {
  AbstractControl, FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'co-date-picker',
  template: ` <ng-container *ngIf="dateControl" [formGroup]="$any(dateControl)">
    <input formControlName="month" placeholder="mm" type="number" />
    <input formControlName="day" placeholder="dd" type="number" />
    <input formControlName="year" placeholder="yyyy" type="number" />
  </ng-container>`,
  styles: [
    `
      input {
        width: 45px;
      }
    `,
  ],
})
export class DatePickerComponent {
  @Input() dateControl?: AbstractControl;

  static createControl(): AbstractControl {
    return new FormGroup({
      day: new FormControl(),
      month: new FormControl(),
      year: new FormControl(),
    });
  }

  static valueToDate(value: unknown): Date | undefined {
    const {year, month, day} = value as {year: number, month: number, day: number};
    if (year == null || month == null || day == null) {
      return undefined;
    }
    return new Date(year, month - 1, day);
  }
}

@NgModule({
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DatePickerModule {}
