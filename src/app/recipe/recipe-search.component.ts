import { AsyncPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CatalogComponent } from './../shared/catalog.component';
import { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository.service';
import { RouterLink } from '@angular/router';
import { Cart } from '../cart/cart.service';
import { rxComputed } from '@jscutlery/rx-computed';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-search',
  imports: [
    AsyncPipe,
    CatalogComponent,
    MatButtonModule,
    NgFor,
    RecipeFilterComponent,
    RecipePreviewComponent,
    RouterLink,
  ],
  template: `
    <wm-recipe-filter
      (filterChange)="presenter.filter.set($event)"
    ></wm-recipe-filter>
    <wm-catalog>
      <wm-recipe-preview
        *ngFor="let recipe of presenter.recipes(); trackBy: trackById"
        [recipe]="recipe"
      >
        <button
          [disabled]="!recipe.canAdd"
          (click)="addRecipe(recipe)"
          mat-button
          color="primary"
        >
          ADD
        </button>
        <a [routerLink]="['/recipe', recipe.id]"
          ><button mat-button>LET'S COOK</button></a
        >
      </wm-recipe-preview>
    </wm-catalog>
  `,
})
export class RecipeSearchComponent {
  presenter = createRecipeSearchPresenter();

  private _cart = inject(Cart);

  trackById(_: number, recipe: Recipe) {
    return recipe.id;
  }

  addRecipe(recipe: Recipe) {
    this._cart.addRecipe(recipe);
  }
}

export default RecipeSearchComponent;

function createRecipeSearchPresenter() {
  const cart = inject(Cart);
  const repo = inject(RecipeRepository);

  const filter = signal<RecipeFilter>({});

  const searchedRecipes = rxComputed(() => repo.search(filter()));

  const recipes = computed(() => {
    return searchedRecipes()?.map((recipe) => {
      return {
        ...recipe,
        canAdd: cart.canAdd(recipe),
      };
    });
  });

  return {
    filter,
    recipes,
  };
}
