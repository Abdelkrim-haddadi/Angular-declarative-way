import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todo',
    loadComponent: () => import('./todo/todo.component').then((module) => module.default),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todo',
  },
];
