import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'welcome',
    loadComponent: () => import('./welcome.component'),
  },
  {
    path: 'search',
    loadComponent: () => import('./recipe/recipe-search.component'),
  },
  {
    path: 'recipe/:recipeId',
    loadComponent: () => import('./recipe/recipe-detail-page.component'),
  },
  {
    path: '**',
    redirectTo: '/welcome',
  },
];
