import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GridComponent } from '@whiskmate/shared/ui';
import { RecipePreviewComponent } from '@whiskmate/recipe-shared/ui';
import { RecipeAddButtonComponent } from '@whiskmate/meal-planner/recipe-add-button-feature';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-suggestions',
  imports: [GridComponent, RecipePreviewComponent, RecipeAddButtonComponent],
  template: `
    <h2>Suggestions d'Ottolenghi</h2>

    <wm-grid>
      @for (recipe of recipes;track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
      }
    </wm-grid>
  `,
  styles: [
    `
      :host {
        text-align: center;
      }
    `,
  ],
})
export class RecipeSuggestionsComponent {
  recipes = [
    {
      id: 'rec_babaganoush',
      name: 'Babaganoush by Ottolenghi',
      description: 'A delicious Babaganoush.',
      ingredients: [],
      pictureUri:
        'https://ottolenghi.co.uk/pub/media/contentmanager/content/cache/646x458//Baba-Ganoush-1.jpg',
      steps: [],
    },
    {
      id: 'rec_beef',
      name: 'Beef with Garlic by Ottolenghi',
      description: 'A delicious Beef with Garlic.',
      pictureUri:
        'https://ottolenghi.co.uk/pub/media/contentmanager/content/cache/646x458//Barbecue-beef-short-ribs-with-black-garlic-and-urfa-chilli.jpg',
      ingredients: [],
      steps: [],
    },
  ];
}
