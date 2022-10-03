import { recipeMother } from './app/testing/recipe-mother';
import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RecipeRepositoryFake } from './app/recipe-repository/recipe-repository.fake';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeRepository } from './app/recipe-repository/recipe-repository.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule, BrowserModule),
    {
      provide: RecipeRepository,
      useFactory(): RecipeRepository {
        const fakeRepo = new RecipeRepositoryFake();
        fakeRepo.setRecipes([
          recipeMother.withBasicInfo('🍔 Burger').build(),
          recipeMother.withBasicInfo('🍕 Pizza').build(),
          recipeMother.withBasicInfo('🥗 Salad').build(),
        ]);
        return fakeRepo;
      },
    },
  ],
});
