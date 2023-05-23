import { RecipeSearchComponent } from './recipe/recipe-search.component';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './shared/toolbar.component';
import { ToolbarChipComponent } from './shared/toolbar-chip.component';

@Component({
  standalone: true,
  selector: 'wm-root',
  imports: [
    MatToolbarModule,
    RecipeSearchComponent,
    MatToolbarModule,
    ToolbarComponent,
    ToolbarChipComponent,
  ],
  template: `
    <wm-toolbar title="Whiskmate">
      <wm-toolbar-chip>🛒</wm-toolbar-chip>
    </wm-toolbar>
    <wm-recipe-search/>
  `,
})
export class AppComponent {}
