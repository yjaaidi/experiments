import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'search',
    loadComponent: () => import('./recipe/recipe-search.component'),
  },
  {
    path: 'meals',
    loadComponent: () => import('./meal-planner/meals.component'),
  },
  {
    path: '**',
    redirectTo: '/search?country=fr',
  },
];
