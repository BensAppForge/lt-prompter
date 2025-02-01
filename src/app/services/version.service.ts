import { Injectable, inject, signal } from '@angular/core';
import { Observable, BehaviorSubject, from, map, catchError, firstValueFrom, of } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Version } from '../models/version.model';
import { environment } from '../../environments/environment';

// Type for new versions (without id)
type NewVersion = Omit<Version, 'id'>;

class VersionError extends Error {
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'VersionError';
  }
}

@Injectable({ providedIn: 'root' })
export class VersionService {
  private readonly dbService = inject(NgxIndexedDBService);
  private readonly STORE_NAME = 'versions' as const;
  private readonly versionsSubject = new BehaviorSubject<Version[]>([]);
  private readonly INITIAL_VERSIONS: NewVersion[] = [
    {
      versionNumber: '1.0.0',
      releaseDate: new Date('2025-01-30'),
      shortDescription: 'Erste Version',
      longDescription: `
        - Erste Version der LT Prompter App
        - Grundlegende Funktionalität implementiert
        - Basis-UI erstellt
      `.trim(),
    },
    {
      versionNumber: '1.1.0',
      releaseDate: new Date('2025-01-31'),
      shortDescription: 'Updateinfo und Versionslog',
      longDescription: `
        - Nutzer werden über Updates informiert
        - Nutzer können ein Versionslog einsehen
      `.trim(),
    },
  ];

  readonly currentVersion = signal<Version | undefined>(undefined);
  readonly hasUpdate = signal<boolean>(false);
  readonly updateMessage = signal<string>('');
  readonly isLoading = signal<boolean>(true);
  readonly isFirstRun = signal<boolean>(false);

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Get all versions
      const versions = await firstValueFrom(
        from(this.dbService.getAll<Version>(this.STORE_NAME))
      );

      if (!versions || versions.length === 0) {
        // No versions found, seed initial versions
        console.log('No versions found, seeding initial versions...');
        await this.seedInitialVersions();
      } else {
        console.log('Existing versions found:', versions);
        // Sort versions by date and update the subject
        const sortedVersions = this.sortVersions(versions);
        this.versionsSubject.next(sortedVersions);
        
        // Set current version
        this.currentVersion.set(sortedVersions[0]);
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async seedInitialVersions(): Promise<void> {
    try {
      for (const version of this.INITIAL_VERSIONS) {
        // Cast to any to bypass type checking since we know the DB will add the id
        await firstValueFrom(
          from(this.dbService.add(this.STORE_NAME, version as any))
        );
      }

      // After seeding, get all versions again
      const versions = await firstValueFrom(
        from(this.dbService.getAll<Version>(this.STORE_NAME))
      );
      
      const sortedVersions = this.sortVersions(versions);
      this.versionsSubject.next(sortedVersions);
      this.currentVersion.set(sortedVersions[0]);
      this.isFirstRun.set(true);
    } catch (error) {
      console.error('Error seeding initial versions:', error);
      throw error;
    }
  }

  private sortVersions(versions: Version[]): Version[] {
    return versions.sort((a, b) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  }

  getAllVersions(): Observable<Version[]> {
    // If we already have versions, return them immediately
    if (this.versionsSubject.value.length > 0) {
      return this.versionsSubject.asObservable();
    }

    // Otherwise, get them from the database
    return from(this.dbService.getAll<Version>(this.STORE_NAME)).pipe(
      map(versions => {
        const sortedVersions = this.sortVersions(versions);
        this.versionsSubject.next(sortedVersions);
        return sortedVersions;
      }),
      catchError(error => {
        console.error('Error getting versions:', error);
        return of([]);
      })
    );
  }

  isInitialized(): Observable<boolean> {
    return of(true).pipe(
      map(() => {
        const versions = this.versionsSubject.value;
        return versions.length > 0;
      })
    );
  }

  checkForUpdates(): void {
    const currentVersion = this.currentVersion();
    if (!currentVersion) return;

    if (currentVersion.versionNumber !== environment.version) {
      this.hasUpdate.set(true);
      this.updateMessage.set(`Eine neue Version ist verfügbar: ${environment.version}`);
    }
  }
}
