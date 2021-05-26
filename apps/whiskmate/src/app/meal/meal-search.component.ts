import { MealRepository } from './meal-repository.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MealFilterModule } from './meal-filter.component';
import { MealFilter } from './meal-filter';
import { MealModule } from './meal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-meal-search',
  template: `
    <div class="filter-container">
      <wm-meal-filter (filterChange)="filter$.next($event)"></wm-meal-filter>
    </div>
    <div class="meals">
      <wm-meal-preview
        *ngFor="let meal of meals$ | async"
        [meal]="meal"
      ></wm-meal-preview>
    </div>
  `,
  styles: [
    `
      :host {
        max-width: 1000px;
      }

      .filter-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
      }

      .meals {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 30px;
        justify-content: center;
      }
    `,
  ],
})
export class MealSearchComponent {
  filter$ = new BehaviorSubject<MealFilter>({});

  meals$ = this.filter$.pipe(
    switchMap((filter) => this._mealRepository.getMeals(filter))
  );

  constructor(private _mealRepository: MealRepository) {}
}

@NgModule({
  declarations: [MealSearchComponent],
  exports: [MealSearchComponent],
  imports: [CommonModule, MealFilterModule, MealModule],
})
export class MealSearchModule {}
