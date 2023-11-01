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

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    // provideRecipeRepositoryFake(),
    // {
    //   provide: APP_INITIALIZER,
    //   multi: true,
    //   useFactory() {
    //     const fake = inject(RecipeRepositoryFake);
    //     return () => {
    //       fake.setRecipes([
    //         recipeMother.withBasicInfo('Burger').build(),
    //         recipeMother.withBasicInfo('Salad').build(),
    //         recipeMother.withBasicInfo('Beer').build(),
    //       ]);
    //     };
    //   },
    // }
  ],
};
