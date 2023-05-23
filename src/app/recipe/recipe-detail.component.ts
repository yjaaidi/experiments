import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RecipePreviewComponent } from './recipe-preview.component';
import { Recipe } from './recipe';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-detail',
  imports: [NgForOf, RecipePreviewComponent],
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
