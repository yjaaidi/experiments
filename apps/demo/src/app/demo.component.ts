import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-demo',
  template: `
    <mat-form-field color="accent" appearance="fill">
      <mat-label>Select a date</mat-label>
      <input matInput [matDatepicker]="picker" [formControl]="control" />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
})
export class DemoComponent {
  control = new FormControl();
  something() {
    alert('wtf');
  }
}

@NgModule({
  declarations: [DemoComponent],
  entryComponents: [DemoComponent],
  exports: [DemoComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
})
export class DemoModule {}
