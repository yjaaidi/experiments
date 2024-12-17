import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { recipeMother } from '../testing/recipe.mother';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideAppInitializer(() => {
      const repo = inject(RecipeRepositoryFake);
      repo.setDelay(500);
      repo.setRecipes([
        recipeMother.withBasicInfo('Burger').build(),
        recipeMother.withBasicInfo('Salad').build(),
        recipeMother.withBasicInfo('Beer').build(),
        recipeMother.withBasicInfo('Truffle Burger').build(),
        recipeMother.withBasicInfo('Greek Salad').build(),
        recipeMother.withBasicInfo('Dark Beer').build(),
      ]);
    }),
    provideRouter(appRoutes),
    provideRecipeRepositoryFake(),
    provideExperimentalZonelessChangeDetection(),
  ],
};
