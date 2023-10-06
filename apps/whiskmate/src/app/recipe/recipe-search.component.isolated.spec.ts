import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { recipeMother } from '../testing/recipe.mother';

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without filtering', async () => {
    const { getRecipeNames } = createComponent();

    expect(await getRecipeNames()).toEqual(['Burger', 'Salad']);
  });

  function createComponent() {
    const fakeRepo = new RecipeRepositoryFake();

    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);

    TestBed.configureTestingModule({
      providers: [
        RecipeSearchComponent,
        {
          provide: RecipeRepository,
          useValue: fakeRepo,
        },
      ],
    });

    const component = TestBed.inject(RecipeSearchComponent);

    return {
      component,
      async getRecipeNames() {
        const items = await firstValueFrom(component.items$);
        return items.map((item) => item.recipe.name);
      },
    };
  }
});
