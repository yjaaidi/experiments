import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { firstValueFrom } from 'rxjs';
import { RecipeRepository } from '../recipe-repository/recipe-repository.service';
import { RecipeRepositoryFake } from './../recipe-repository/recipe-repository.fake';
import { recipeMother } from './../testing/recipe-mother';
import { MealPlanner } from './meal-planner.service';
import { RecipeSearchComponent } from './recipe-search.component';

describe(RecipeSearchComponent.name, () => {
  it('should add recipe to meal planner when clicked', () => {
    const { clickFirstAddButton, getMealPlannerRecipes } = renderRecipeSearch();

    clickFirstAddButton();

    getMealPlannerRecipes().should('have.length', 1);
    getMealPlannerRecipes().its('0.name').should('equal', '🍔 Burger');

    cy.percySnapshot();
  });

  function renderRecipeSearch() {
    cy.mount(RecipeSearchComponent, {
      imports: [BrowserAnimationsModule],
      providers: [
        {
          provide: RecipeRepository,
          useFactory(): RecipeRepository {
            const repo = new RecipeRepositoryFake();
            repo.setRecipes([
              recipeMother.withBasicInfo('🍔 Burger').build(),
              recipeMother.withBasicInfo('🥟 Maultaschen').build(),
              recipeMother.withBasicInfo('🍺 Beer').build(),
            ]);
            return repo;
          },
        },
      ],
    });

    return {
      clickFirstAddButton() {
        cy.getByDataRole('add-recipe').eq(0).click();
      },
      getMealPlannerRecipes() {
        return cy.then(() =>
          firstValueFrom(TestBed.inject(MealPlanner).recipes$)
        );
      },
    };
  }
});
