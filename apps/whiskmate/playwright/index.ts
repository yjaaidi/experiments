import '@angular/compiler';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import 'zone.js';
import '../src/styles.css';

import { provideAnimations } from '@angular/platform-browser/animations';
import { beforeMount } from '@jscutlery/playwright-ct-angular/hooks';
import { provideRecipeRepositoryFake } from '../src/app/recipe/recipe-repository.fake';

beforeMount(async ({ TestBed }) => {
  TestBed.configureTestingModule({
    providers: [provideAnimations(), provideRecipeRepositoryFake()],
  });
});
