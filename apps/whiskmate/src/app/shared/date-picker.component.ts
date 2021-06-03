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
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-date-picker',
  template: ` <ng-container *ngIf="dateControl">
    <input
      data-role="date-input"
      type="date"
      [formControl]="$any(dateControl)"
    />
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
    return new Date(Date.parse(value as string));
  }
}

@NgModule({
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DatePickerModule {}
