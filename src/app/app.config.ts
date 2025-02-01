import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { PLATFORM_ID } from '@angular/core';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

const DB_NAME = 'LT_Prompter_DB';
const DB_VERSION = 1;

const dbConfig = {
  name: DB_NAME,
  version: DB_VERSION,
  objectStoresMeta: [
    {
      store: 'preferences',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'language', keypath: 'language', options: { unique: false } },
        { name: 'level', keypath: 'level', options: { unique: false } },
        { name: 'theme', keypath: 'theme', options: { unique: false } },
      ]
    },
    {
      store: 'templates',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'content', keypath: 'content', options: { unique: false } },
        { name: 'exerciseType', keypath: 'exerciseType', options: { unique: false } },
        { name: 'language', keypath: 'language', options: { unique: false } },
        { name: 'cefrLevel', keypath: 'cefrLevel', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
        { name: 'isDefault', keypath: 'isDefault', options: { unique: false } }
      ]
    }
  ]
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(),
    { 
      provide: NgxIndexedDBService, 
      useFactory: (platformId: Object) => {
        const config = { [DB_NAME]: dbConfig };
        return new NgxIndexedDBService(config, platformId);
      },
      deps: [PLATFORM_ID]
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
