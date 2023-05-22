import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'search',
    loadComponent: () =>
      import('@whiskmate/recipe/feature-recipe-search').then(
        (m) => m.RecipeSearchComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'search',
  },
];
