import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Recipe } from './recipe';
import { Card } from '../shared/card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-preview',
  template: `
    <wm-card [alt]="recipe.name" [pictureUri]="recipe.pictureUri">
      <h2>{{ recipe.name }}</h2>
    </wm-card>
  `,
  styles: `
    h2 {
      font-size: 1.2em;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  imports: [Card],
})
export class RecipePreview {
  @Input({ required: true }) recipe!: Recipe;
}
