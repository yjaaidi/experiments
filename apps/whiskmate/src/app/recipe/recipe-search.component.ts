import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { rxResource } from '@angular/core/rxjs-interop';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeAddButtonComponent } from './recipe-add-button.component';
import { MessageComponent } from '../shared/message.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    MessageComponent,
    MatButtonModule,
    RecipeFilterComponent,
    RecipeListComponent,
    RecipeAddButtonComponent,
  ],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)"></wm-recipe-filter>

    @if (recipesResource.isLoading()) {
      <wm-message>⏳ Searching...</wm-message>
    }
    @if (recipesResource.error()) {
      <wm-message> 💥 Something went wrong</wm-message>
    }

    @if (recipesResource.value(); as recipes) {
      @if (recipes && recipes.length > 0) {
        <wm-recipe-list [recipes]="recipes">
          <ng-template #actions let-recipe>
            <wm-recipe-add-button [recipe]="recipe" />
          </ng-template>
        </wm-recipe-list>
      } @else {
        <wm-message> 😿 no results</wm-message>
      }
    }
  `,
})
export class RecipeSearchComponent {
  filter = signal<RecipeFilter>({});
  recipesResource = rxResource({
    request: this.filter,
    loader: ({ request }) => this._recipeRepository.search(request.keywords),
  });

  private _recipeRepository = inject(RecipeRepository);
}

export default RecipeSearchComponent;
