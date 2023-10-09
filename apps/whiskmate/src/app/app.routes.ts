import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'search',
    loadComponent: () => import('@whiskmate/recipe/search-feature'),
  },
  {
    path: 'meals',
    loadComponent: () => import('@whiskmate/meal-planner/meals-feature'),
  },
  {
    path: '**',
    redirectTo: '/search?country=fr',
  },
];
