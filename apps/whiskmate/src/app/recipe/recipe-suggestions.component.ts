import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Recipe } from './recipe';
import { RecipePreviewComponent } from './recipe-preview.component';
import { GridComponent } from '../shared/grid.component';
import { trackById } from '../shared/track-by-id';
import { RecipeAddButtonComponent } from './recipe-add-button.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-suggestions',
  imports: [
    AsyncPipe,
    GridComponent,
    MatButtonModule,
    NgForOf,
    RecipePreviewComponent,
    RecipeAddButtonComponent,
    NgIf,
  ],
  template: `
    <h2>Suggestions d'Ottolenghi</h2>
    <wm-grid>
      <wm-recipe-preview
        *ngFor="let recipe of recipes; trackBy: trackById"
        [recipe]="recipe"
      >
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
    </wm-grid>
  `,
})
export class RecipeSuggestionsComponent {
  recipes: Recipe[] = [
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
  trackById = trackById;
}
