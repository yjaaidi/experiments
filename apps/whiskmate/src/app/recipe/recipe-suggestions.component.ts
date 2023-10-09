import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RecipePreviewComponent } from './recipe-preview.component';
import { GridComponent } from '../shared/grid.component';
import { trackById } from '../shared/track-by-id';
import { RecipeAddButtonComponent } from './recipe-add-button.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, defer, of } from 'rxjs';
import { rxComputed } from '@jscutlery/rx-computed';
import { pending, suspensify } from '@jscutlery/operators';
import { MessageComponent } from '../shared/message.component';

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
    MessageComponent,
  ],
  template: `
    <h2>Suggestions d'Ottolenghi</h2>

    <wm-message *ngIf="suggestionsSuspense().hasError">
      💥 Something went wrong
    </wm-message>

    <wm-grid>
      <wm-recipe-preview
        *ngFor="let recipe of suggestions(); trackBy: trackById"
        [recipe]="recipe"
      >
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
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
  suggestionsSuspense = rxComputed(
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

  trackById = trackById;

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
