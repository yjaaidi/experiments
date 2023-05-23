import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { NgForOf } from '@angular/common';
import { RecipePreviewComponent } from './recipe-preview.component';
import { Recipe } from './recipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-detail',
  template: `
        <wm-recipe-preview [recipe]="recipe"/>

        <h2>Ingredients</h2>
        <ul>
            <li *ngFor="let ingredient of recipe.ingredients">
                {{ingredient.name}}
            </li>
        </ul>
    `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
})
export class RecipeDetailComponent {
  @Input({ required: true }) recipe!: Recipe;
}

@NgModule({
  declarations: [RecipeDetailComponent],
  exports: [RecipeDetailComponent],
  imports: [NgForOf, RecipePreviewComponent],
})
export class RecipeDetailModule {}
