import { Component, Input } from '@angular/core';
import { Recipe } from './recipe';

@Component({
  standalone: true,
  selector: 'demo-recipe',
  template: `<h2>{{ recipe.name }}</h2>
    <img [src]="recipe.pictureUri" />`,
  styles: `
    img {
      max-width: 200px;
    }
  `,
})
export class RecipeComponent {
  @Input({ required: true }) recipe!: Recipe;
}
