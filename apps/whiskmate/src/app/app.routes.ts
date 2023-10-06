import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'search',
    loadComponent: () => import('./recipe/recipe-search.component'),
  },
  {
    path: '**',
    redirectTo: '/search',
  },
];
