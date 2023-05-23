import { RecipeSearchComponent } from './recipe/recipe-search.component';
import { Component } from '@angular/core';
import { ToolbarComponent } from './shared/toolbar.component';
import { ToolbarChipComponent } from './shared/toolbar-chip.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'wm-root',
  imports: [
    RecipeSearchComponent,
    RouterOutlet,
    ToolbarComponent,
    ToolbarChipComponent,
  ],
  template: `
      <wm-toolbar title="Whiskmate"/>
      <router-outlet/>
  `,
})
export class AppComponent {}
