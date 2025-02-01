import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./components/template-manager/template-manager.component')
      .then(m => m.TemplateManagerComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/preferences/preferences.component')
      .then(m => m.PreferencesComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
