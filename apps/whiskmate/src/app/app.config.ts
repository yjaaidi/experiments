import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe/recipe-repository.fake';
import { recipeMother } from './testing/recipe.mother';
import { provideAppInitializer } from './shared/provide-app-initializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    // provideRecipeRepositoryFake(),
    // provideAppInitializer(() => {
    //   inject(RecipeRepositoryFake).setRecipes([
    //     recipeMother.withBasicInfo('Burger').build(),
    //     recipeMother.withBasicInfo('Salad').build(),
    //     recipeMother.withBasicInfo('Beer').build(),
    //   ]);
    // }),
  ],
};
