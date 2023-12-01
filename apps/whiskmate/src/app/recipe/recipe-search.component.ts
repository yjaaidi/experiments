import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { rxComputed } from '@jscutlery/rx-computed';
import { pending, suspensify } from '@jscutlery/operators';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeAddButtonComponent } from './recipe-add-button.component';
import { GridComponent, MessageComponent } from '@whiskmate/shared-ui';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-search',
  imports: [
    GridComponent,
    MessageComponent,
    MatButtonModule,
    RecipeFilterComponent,
    RecipePreviewComponent,
    RecipeListComponent,
    RecipeAddButtonComponent,
  ],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)"></wm-recipe-filter>

    @if(recipesSuspense().pending) {
    <wm-message>⏳ Searching...</wm-message>
    }

    <!-- prettier-ignore -->
    @if (recipesSuspense().hasError) {
    <wm-message> 💥 Something went wrong </wm-message>
    }

    <!-- prettier-ignore -->
    @if (recipesSuspense().hasValue && recipes().length === 0) {
    <wm-message> 😿 no results </wm-message>
    }

    <!-- prettier-ignore -->
    @if(recipesSuspense().hasValue && recipes().length > 0) {
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
  recipesSuspense = rxComputed(
    () => this._recipeRepository.search(this.filter()).pipe(suspensify()),
    { initialValue: pending }
  );
  recipes = () => {
    const suspense = this.recipesSuspense();
    return suspense.hasValue ? suspense.value : [];
  };

  private _recipeRepository = inject(RecipeRepository);
}

export default RecipeSearchComponent;
