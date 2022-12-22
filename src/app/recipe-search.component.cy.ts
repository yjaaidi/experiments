import { recipeMother } from './testing/recipe.mother';
import { RecipeRepositoryFake } from './testing/recipe-repository.fake';
import { RecipeRepository } from './recipe-repository.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeSearchComponent } from './recipe-search.component';

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without keyword on load', () => {
    const fakeRepo = new RecipeRepositoryFake();
    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Burger').build(),
    ]);
    cy.mount(RecipeSearchComponent, {
      imports: [BrowserAnimationsModule],
      providers: [
        {
          provide: RecipeRepository,
          useValue: fakeRepo,
        },
      ],
    });
    cy.get('[data-role=recipe-name]').eq(0).should('contain', 'Beer');
    cy.get('[data-role=recipe-name]').eq(1).should('contain', 'Burger');
  });
});
