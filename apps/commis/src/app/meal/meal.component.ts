import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { Meal } from './meal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'co-meal-preview',
  template: `<ng-container *ngIf="meal">
    <img
      class="picture"
      [src]="meal.recipeInfo.pictureUri"
      [alt]="meal.recipeInfo.name">
    <div class="content">
      <div class="date">{{ meal.date | date }}</div>
      <h2>{{meal.recipeInfo.name}}</h2>
    </div>
  </ng-container>`,
  styles: [
    `
    :host {
      display: block;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
      overflow: hidden;
      text-align: left;
      width: 300px;
    }

    .picture {
      object-fit: cover;
      height: 300px;
      width: 100%;
    }

    .content {
      margin: 10px;
    }

    .date {
      color: rgba(0,0,0,.8);
      text-align: right;
    }
    `
  ]
})
export class MealComponent {
  @Input() meal?: Meal;
}

@NgModule({
  declarations: [MealComponent],
  exports: [MealComponent],
  imports: [CommonModule]
})
export class MealModule {}
