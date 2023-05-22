import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipeRepository } from '@whiskmate/recipe/data-access';
import { RecipePreviewComponent } from '@whiskmate/recipe/ui';
import { PageComponent } from '@whiskmate/shared/ui';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'whiskmate-recipe-search',
  imports: [RecipePreviewComponent, PageComponent, AsyncPipe, NgFor],
  template: `
    <whiskmate-page title="Recipe Search">
      <whiskmate-recipe-preview *ngFor="let recipe of recipes$ | async" [recipe]="recipe"/>
    </whiskmate-page>
  `,
})
export class RecipeSearchComponent {
  recipes$ = inject(RecipeRepository).searchRecipes();
}
