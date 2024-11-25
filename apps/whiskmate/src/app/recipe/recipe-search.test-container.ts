import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import RecipeSearchComponent from './recipe-search.component';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { recipeMother } from '../testing/recipe.mother';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipeSearchComponent],
  template: ` <wm-recipe-search />`,
})
export class RecipeSearchTestContainer {
  constructor() {
    inject(RecipeRepositoryFake).setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);
  }
}
