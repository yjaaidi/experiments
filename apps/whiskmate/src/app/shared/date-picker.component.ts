import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-date-picker',
  template: ` <ng-container *ngIf="dateControl">
    <mat-form-field>
      <input
        matInput
        [matDatepicker]="picker"
        [formControl]="$any(dateControl)"
      />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
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
    return new FormControl();
  }

  static valueToDate(value: unknown): Date | undefined {
    const date = value as Date;
    if (date == null) {
      return;
    }
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
}

@NgModule({
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
})
export class DatePickerModule {}
