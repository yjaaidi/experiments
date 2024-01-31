import { Component, computed, input } from '@angular/core';
import { Recipe } from './recipe';

@Component({
  standalone: true,
  selector: 'demo-recipe',
  template: `<h2>{{ recipe().name }}</h2>
    <img [src]="pictureUri()" />`,
  styles: [
    `
      img {
        max-width: 200px;
      }
    `,
  ],
})
export class RecipeComponent {
  recipe = input.required<Recipe>();
  pictureUri = computed(() => {
    const pictureUri = this.recipe().pictureUri;

    if (this._isValidPictureUri(pictureUri)) {
      return pictureUri;
    }

    return 'TODO';
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _isValidPictureUri(pictureUri: string) {
    // expensive
    return true;
  }
}
