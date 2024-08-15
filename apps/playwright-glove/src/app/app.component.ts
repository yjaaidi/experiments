import { DatePipe } from '@angular/common';
import { Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [DatePipe, FormsModule],
  template: `
    <div data-testid="datepicker" aria-label="main">
      <input [(ngModel)]="day" aria-label="day" type="number" />
      <input [(ngModel)]="month" aria-label="month" type="number" />
      <input [(ngModel)]="year" aria-label="year" type="number" />
    </div>
    <hr />
    <div data-testid="datepicker">
      <input [(ngModel)]="day" aria-label="day" type="number" />
      <input [(ngModel)]="month" aria-label="month" type="number" />
      <input [(ngModel)]="year" aria-label="year" type="number" />
    </div>
    <hr />
    <div role="article">{{ date() | date }}</div>
  `,
})
export class AppComponent {
  day = model<number | undefined>(undefined);
  month = model<number | undefined>(undefined);
  year = model<number | undefined>(undefined);
  date = computed(() => {
    return new Date(
      this.year() ?? new Date().getUTCFullYear(),
      (this.month() ?? 1) - 1,
      this.day() ?? 1
    );
  });
}
