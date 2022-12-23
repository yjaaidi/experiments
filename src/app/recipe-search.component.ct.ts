import { disableDebugTools } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';
import { octopus } from './testing/octopus';
import { RecipeRepositoryFake } from './testing/recipe-repository.fake';
import { recipeMother } from './testing/recipe.mother';

const { describe, it, expect, click, find, findAll, mount } = octopus;

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without keyword on load', async () => {
    await mountWithSomeRecipes();

    const els = await findAll('[data-role=recipe-name]');
    expect(els[0].textContent).toEqual('Beer');
    expect(els[1].textContent).toEqual('Burger');
  });

  it('should disable add button once recipe is added', async () => {
    const { getAddButton } = await mountWithSomeRecipes();

    click(await getAddButton());

    expect((await getAddButton()).disabled).toEqual(true);
  });

  async function mountWithSomeRecipes() {
    const fakeRepo = new RecipeRepositoryFake();
    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Burger').build(),
    ]);

    await mount(RecipeSearchComponent, {
      imports: [BrowserAnimationsModule],
      providers: [
        {
          provide: RecipeRepository,
          useValue: fakeRepo,
        },
      ],
    });

    return {
      getAddButton() {
        return find<HTMLButtonElement>('[data-role=add-recipe]');
      },
    };
  }
});
