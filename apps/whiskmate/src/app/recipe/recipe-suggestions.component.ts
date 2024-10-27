import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { pending, suspensify } from '@jscutlery/operators';
import { catchError, defer, of } from 'rxjs';
import { RecipePreviewComponent } from './recipe-preview.component';
import { GridComponent } from '../shared/grid.component';
import { RecipeAddButtonComponent } from './recipe-add-button.component';
import { MessageComponent } from '../shared/message.component';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-suggestions',
  imports: [
    GridComponent,
    MatButtonModule,
    RecipePreviewComponent,
    RecipeAddButtonComponent,
    MessageComponent,
  ],
  template: `
    <h2>Suggestions d'Ottolenghi</h2>

    @if (suggestionsSuspense().hasError) {
    <wm-message> 💥 Something went wrong</wm-message>
    }

    <wm-grid>
      @for (recipe of suggestions(); track recipe.id) {
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
  suggestionsSuspense = derivedAsync(
    () =>
      this._getSuggestions().pipe(
        catchError((error) => {
          console.error(error);
          throw error;
        }),
        suspensify()
      ),
    { initialValue: pending }
  );
  suggestions = () => {
    const suspense = this.suggestionsSuspense();
    return suspense.hasValue ? suspense.value : [];
  };

  private _route = inject(ActivatedRoute);
  private _queryParamMap = toSignal(this._route.queryParamMap);
  private _country = computed(() => this._queryParamMap()?.get('country'));

  private _getSuggestions() {
    return defer(() => {
      if (this._country() === 'fr') {
        return of([
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
        ]);
      } else {
        throw new Error('unknown country');
      }
    });
  }
}
