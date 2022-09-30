import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'wm-app',
  imports: [RecipeSearchComponent],
  template: `<wm-recipe-search></wm-recipe-search>`,
})
export class AppComponent {}
