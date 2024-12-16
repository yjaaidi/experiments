import { Route } from '@angular/router';
import { RecipeSearch } from './recipe-search.component';

export const appRoutes: Route[] = [
  { path: 'recipes', component: RecipeSearch },
  { path: '**', redirectTo: '/recipes' },
];
