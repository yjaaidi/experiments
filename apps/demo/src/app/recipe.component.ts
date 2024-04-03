import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Recipe } from './recipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'demo-recipe',
  template: `<h2>{{ recipe().name }}</h2>
    <img [src]="recipe().pictureUri" />`,
})
export class RecipeComponent {
  recipe = input.required<Recipe>();
}
