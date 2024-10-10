import '@angular/compiler';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import 'zone.js';
import '../src/styles.css';

import { provideAnimations } from '@angular/platform-browser/animations';
import { beforeMount } from '@jscutlery/playwright-ct-angular/hooks';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from '../src/app/recipe/recipe-repository.fake';
import { recipeMother } from '../src/app/testing/recipe.mother';
import { provideHttpClient } from '@angular/common/http';

beforeMount(async ({ TestBed }) => {
  TestBed.configureTestingModule({
    providers: [provideAnimations(), provideHttpClient()],
  });
});
