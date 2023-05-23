import { Route } from '@angular/router';
import WelcomeComponent from './welcome.component';
import RecipeDetailPageComponent from './recipe/recipe-detail-page.component';

export const appRoutes: Route[] = [
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./recipe/recipe-search.routing.module').then(
        (m) => m.RecipeSearchRoutingModule
      ),
  },
  {
    path: 'recipe/:recipeId',
    component: RecipeDetailPageComponent,
  },
  {
    path: '**',
    redirectTo: '/welcome',
  },
];
