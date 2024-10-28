import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { pending, suspensify } from '@jscutlery/operators';
import { derivedAsync } from 'ngxtension/derived-async';
import { RecipeFilterComponent } from '@whiskmate/recipe/ui';
import { RecipeRepository } from '@whiskmate/recipe/infra';
import { RecipeAddButtonComponent } from '@whiskmate/meal-planner/feature-add-button';
import { MessageComponent } from '@whiskmate/shared/ui';
import { RecipeListComponent } from '@whiskmate/recipe-shared/ui';
import { RecipeFilter } from '@whiskmate/recipe/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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

    @if (recipesSuspense().pending) {
      <wm-message>⏳ Searching...</wm-message>
    }

    @if (recipesSuspense().hasError) {
      <wm-message> 💥 Something went wrong</wm-message>
    }

    @if (recipesSuspense().hasValue && recipes().length === 0) {
      <wm-message> 😿 no results</wm-message>
    }

    @if (recipesSuspense().hasValue && recipes().length > 0) {
      <wm-recipe-list [recipes]="recipes()">
        <ng-template #actions let-recipe>
          <wm-recipe-add-button [recipe]="recipe" />
        </ng-template>
      </wm-recipe-list>
    }
  `,
})
export class RecipeSearchComponent {
  filter = signal<RecipeFilter>({});
  recipesSuspense = derivedAsync(
    () => this._recipeRepository.search(this.filter()).pipe(suspensify()),
    { initialValue: pending },
  );
  recipes = () => {
    const suspense = this.recipesSuspense();
    return suspense.hasValue ? suspense.value : [];
  };

  private _recipeRepository = inject(RecipeRepository);
}

export default RecipeSearchComponent;
