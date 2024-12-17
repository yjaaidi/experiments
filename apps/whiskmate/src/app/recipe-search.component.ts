import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RecipeFilter } from './recipe-filter.component';
import { Paginator } from '../shared/paginator.component';
import { RecipePreview } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository';
import { Catalog } from '../shared/catalog.component';
import { Recipe } from './recipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  template: `
    @if (recipesResource.isLoading()) {
      <mat-progress-bar class="progress-bar" mode="indeterminate" />
    }

    <wm-recipe-filter [(keywords)]="keywords" />

    <wm-catalog>
      @if (recipesResource.error()) {
        <p>Something went wrong</p>
      }
      @for (recipe of recipes(); track recipe.id) {
        <wm-recipe-preview
          [class.loading]="recipesResource.isLoading()"
          [recipe]="recipe"
          class="recipe-preview"
        />
      }
    </wm-catalog>

    <wm-paginator
      [itemsPerPage]="itemsPerPage()"
      [(offset)]="offset"
      [total]="total()"
    />
  `,
  styles: `
    :host {
      display: block;
      margin: auto;
      text-align: center;
    }

    .loading {
      filter: blur(3px) grayscale(80%);
    }

    .recipe-preview {
      transition: filter 0.3s;
    }

    .progress-bar {
      position: fixed;
      top: 0;
    }
  `,
  imports: [MatProgressBar, RecipeFilter, Catalog, RecipePreview, Paginator],
})
export class RecipeSearch {
  keywords = signal<string | undefined>(undefined);
  offset = linkedSignal({
    source: this.keywords,
    computation: () => 0,
  });
  recipesResource = rxResource({
    request: () => ({
      keywords: this.keywords(),
      offset: this.offset(),
    }),
    loader: ({ request }) => this._recipeRepository.search(request),
  });
  recipes = linkedSignal<{ isLoading: boolean; recipes?: Recipe[] }, Recipe[]>({
    source: () => ({
      isLoading: this.recipesResource.isLoading(),
      recipes: this.recipesResource.value()?.items,
    }),
    computation: ({ isLoading, recipes }, previous) => {
      if (isLoading) {
        return previous?.value ?? [];
      }
      return recipes ?? [];
    },
  });
  itemsPerPage = computed(
    () => this.recipesResource.value()?.items.length ?? 10,
  );
  total = computed(() => this.recipesResource.value()?.total ?? 0);

  private _recipeRepository = inject(RecipeRepository);
}
