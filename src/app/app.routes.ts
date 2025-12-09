import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { VersionService } from './services/version.service';

// Resolver function to ensure version service is initialized
function versionResolver() {
  const versionService = inject(VersionService);
  const versions = versionService.getAllVersions();
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
    path: 'grammar',
    loadComponent: () =>
      import('./components/grammar-con/grammar-con.component').then(
        (m) => m.GrammarConComponent
      ),
  },
  {
    path: 'comprehension',
    loadComponent: () =>
      import('./components/comprehension/comprehension.component').then(
        (m) => m.ComprehensionComponent
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
    loadComponent: () =>
      import('./components/template-manager/template-manager.component').then(
        (m) => m.TemplateManagerComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./components/privacy/privacy.component').then(
        (m) => m.PrivacyComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: 'clone',
    loadComponent: () =>
      import('./components/clone/clone.component').then(
        (m) => m.CloneComponent
      ),
  },
  {
    path: 'wordfield',
    loadComponent: () =>
      import('./components/wordfield/wordfield.component').then(
        (m) => m.WordfieldComponent
      ),
  },
  {
    path: 'korrektur',
    loadComponent: () =>
      import('./components/korrektur/korrektur.component').then(
        (m) => m.KorrekturComponent
      ),
  },
  {
    path: 'help',
    loadComponent: () =>
      import('./components/help/help.component').then((m) => m.HelpComponent),
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./components/library/library.component').then(
        (m) => m.LibraryComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
