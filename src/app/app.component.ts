import { RecipeSearchComponent } from './recipe/recipe-search.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'wm-root',
  imports: [RecipeSearchComponent],
  template: `<wm-recipe-search/>`,
})
export class AppComponent {}
