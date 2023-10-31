import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { recipeMother } from '../testing/recipe.mother';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipeSearchComponent],
  providers: [
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake,
    },
    RecipeRepositoryFake,
  ],
  template: `<wm-recipe-search />`,
})
export class RecipeSearchTestContainerComponent {
  constructor() {
    inject(RecipeRepositoryFake).setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);
  }
}
