import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'suggestions',
    loadComponent: () => import('@whiskmate/recipe/suggestions-feature'),
  },
  {
    path: '**',
    redirectTo: '/suggestions',
  },
];
