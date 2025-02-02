import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { VersionService } from './services/version.service';
import { firstValueFrom } from 'rxjs';

// Resolver function to ensure version service is initialized
async function versionResolver() {
  const versionService = inject(VersionService);
  // Wait for versions to be loaded
  const versions = await firstValueFrom(versionService.getAllVersions());
  return versions.length > 0;
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'vocabulary',
    loadComponent: () =>
      import('./components/vocabulary/vocabulary.component').then(
        (m) => m.VocabularyComponent
      ),
  },
  {
    path: 'changelog',
    resolve: { initialized: versionResolver },
    loadComponent: () =>
      import('./components/changelog/changelog.component').then(
        (c) => c.ChangelogComponent
      ),
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
