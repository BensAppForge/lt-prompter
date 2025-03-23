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
const DB_VERSION = 6;

const dbConfig: DBConfig = {
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
      ],
    },
    {
      store: 'templates',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'content', keypath: 'content', options: { unique: false } },
        {
          name: 'exerciseType',
          keypath: 'exerciseType',
          options: { unique: false },
        },
        { name: 'language', keypath: 'language', options: { unique: false } },
        { name: 'cefrLevel', keypath: 'cefrLevel', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
        { name: 'isDefault', keypath: 'isDefault', options: { unique: false } },
      ],
    },
    {
      store: 'versions',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'versionNumber',
          keypath: 'versionNumber',
          options: { unique: true },
        },
        {
          name: 'releaseDate',
          keypath: 'releaseDate',
          options: { unique: false },
        },
        {
          name: 'shortDescription',
          keypath: 'shortDescription',
          options: { unique: false },
        },
        {
          name: 'longDescription',
          keypath: 'longDescription',
          options: { unique: false },
        },
      ],
    },
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
      1: (db, transaction) => {
        const versionsStore = transaction.objectStore('versions');
        versionsStore.clear();
      },
      2: (db, transaction) => {
        const versionsStore = transaction.objectStore('versions');
        versionsStore.clear();
      },
      3: (db, transaction) => {
        const versionsStore = transaction.objectStore('versions');
        versionsStore.clear();
      },
      4: (db, transaction) => {
        const versionsStore = transaction.objectStore('versions');
        versionsStore.clear();
      },
      5: (db, transaction) => {
        const versionsStore = transaction.objectStore('versions');
        versionsStore.clear();
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
