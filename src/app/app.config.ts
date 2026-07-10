import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxIndexedDBService, DBConfig } from 'ngx-indexed-db';
import { PLATFORM_ID } from '@angular/core';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

const DB_NAME = 'LT_Prompter_DB';
const DB_VERSION = 7;

const dbConfig: DBConfig = {
  name: DB_NAME,
  version: DB_VERSION,
  objectStoresMeta: [
    {
      store: 'library',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        {
          name: 'description',
          keypath: 'description',
          options: { unique: false },
        },
        { name: 'category', keypath: 'category', options: { unique: false } },
        {
          name: 'targetLanguage',
          keypath: 'targetLanguage',
          options: { unique: false },
        },
        { name: 'cefr', keypath: 'cefr', options: { unique: false } },
        { name: 'content', keypath: 'content', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
        { name: 'lastUsed', keypath: 'lastUsed', options: { unique: false } },
        { name: 'tags', keypath: 'tags', options: { unique: false } },
      ],
    },
  ],
  migrationFactory: () => {
    return {
      // v7: only 'library' is used — preferences moved to localStorage and
      // the changelog is shipped in code, so drop the abandoned stores.
      // Guarded so fresh installs (which never had them) migrate cleanly.
      7: (db: IDBDatabase) => {
        for (const store of ['preferences', 'templates', 'versions']) {
          if (db.objectStoreNames.contains(store)) {
            db.deleteObjectStore(store);
          }
        }
      },
    };
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideAnimations(),
    {
      provide: NgxIndexedDBService,
      useFactory: (platformId: Object) => {
        const config = { [DB_NAME]: dbConfig };
        return new NgxIndexedDBService(config, platformId);
      },
      deps: [PLATFORM_ID],
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
