import '@angular/compiler';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import 'zone.js';
import '../src/styles.css';

import { provideAnimations } from '@angular/platform-browser/animations';
import { beforeMount } from '@jscutlery/playwright-ct-angular/hooks';

beforeMount(async ({ TestBed }) => {
  TestBed.configureTestingModule({
    providers: [provideAnimations()],
  });
});
