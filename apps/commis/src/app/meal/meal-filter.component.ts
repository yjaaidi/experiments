import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePickerComponent, DatePickerModule } from '../shared/date-picker.component';
import { MealFilter } from './meal-filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'co-meal-filter',
  template: `<form [formGroup]="formGroup">
    <div>
      <span>Start date: </span>
      <co-date-picker [dateControl]="startControl"></co-date-picker>
    </div>
    <div>
      <span>End date&nbsp;&nbsp;: </span>
      <co-date-picker [dateControl]="endControl"></co-date-picker>
    </div>
  </form>`,
  styles: [
    `
      span {
        font-family: monospace;
      }
    `,
  ],
})
export class MealFilterComponent {
  @Output() filterChange: Observable<MealFilter>;

  startControl = DatePickerComponent.createControl();
  endControl = DatePickerComponent.createControl();
  formGroup = new FormGroup({
    start: this.startControl,
    end: this.endControl,
  });

  constructor() {
    this.filterChange = this.formGroup.valueChanges.pipe(
      map((value) => ({
        start: DatePickerComponent.valueToDate(value.start),
        end: DatePickerComponent.valueToDate(value.end),
      }))
    );
  }
}

@NgModule({
  declarations: [MealFilterComponent],
  exports: [MealFilterComponent],
  imports: [CommonModule, DatePickerModule, ReactiveFormsModule],
})
export class MealFilterModule {}
