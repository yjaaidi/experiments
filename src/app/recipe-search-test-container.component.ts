import {Component, inject, Input} from '@angular/core';
import {RecipeSearchComponent} from './recipe-search.component';
import {RecipeRepository} from './recipe-repository.service';
import {RecipeRepositoryFake} from './testing/recipe-repository.fake';
import {Recipe} from './recipe';

@Component({
  standalone: true,
  imports: [RecipeSearchComponent],
  template: '<wm-recipe-search></wm-recipe-search>',
  providers: [
    RecipeRepositoryFake,
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake,
    },
  ],
})
export class RecipeSearchTestContainerComponent {
  private _repo = inject(RecipeRepositoryFake);

  @Input() set recipes(recipes: Recipe[]) {
    this._repo.setRecipes(recipes);
  }
}
