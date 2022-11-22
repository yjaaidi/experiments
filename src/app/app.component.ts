import { Component } from '@angular/core';
import { RecipeSearchComponent } from './recipe-search.component';

@Component({
  standalone: true,
  selector: 'wm-app',
  imports: [RecipeSearchComponent],
  template: ` <wm-recipe-search></wm-recipe-search>`,
})
export class AppComponent {}
