import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'search',
    loadComponent: () => import('@whiskmate/recipe/feature-search'),
  },
  {
    path: 'meals',
    loadComponent: () => import('@whiskmate/meal-planner/feature-meals'),
  },
  {
    path: '**',
    redirectTo: '/search?country=fr',
  },
];
