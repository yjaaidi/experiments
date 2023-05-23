import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import RecipeSearchComponent from './recipe-search.component';

@NgModule({
  imports: [
    RecipeSearchComponent,
    RouterModule.forChild([
      {
        path: '',
        component: RecipeSearchComponent,
      },
    ]),
  ],
})
export class RecipeSearchRoutingModule {}
