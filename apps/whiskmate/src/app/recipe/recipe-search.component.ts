import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { rxComputed } from '@jscutlery/rx-computed';
import { pending, suspensify } from '@jscutlery/operators';
import { GridComponent } from '../shared/grid.component';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeAddButtonComponent } from './recipe-add-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-search',
  imports: [
    AsyncPipe,
    GridComponent,
    MatButtonModule,
    NgIf,
    RecipeFilterComponent,
    RecipePreviewComponent,
    NgForOf,
    RecipeListComponent,
    RecipeAddButtonComponent,
  ],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)"></wm-recipe-filter>

    <div *ngIf="recipesSuspense().pending">⏳ Searching...</div>

    <div *ngIf="recipesSuspense().hasError">💥 Something went wrong.</div>

    <wm-recipe-list *ngIf="recipesSuspense().hasValue" [recipes]="recipes()">
      <ng-template #actions let-recipe>
        <wm-recipe-add-button [recipe]="recipe" />
      </ng-template>
    </wm-recipe-list>
  `,
  styles: [
    `
      :host {
        text-align: center;
      }
    `,
  ],
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
