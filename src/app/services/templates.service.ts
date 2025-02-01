import { Injectable, inject, signal } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, from, map, tap } from 'rxjs';
import { Template, PromptTemplate } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  private readonly STORE_NAME = 'templates';
  private readonly dbService = inject(NgxIndexedDBService);
  templates = signal<Template[]>([]);

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    this.getAllTemplates().subscribe(templates => {
      this.templates.set(templates);
    });
  }

  getAllTemplates(): Observable<Template[]> {
    return from(this.dbService.getAll(this.STORE_NAME))
      .pipe(map(templates => templates as Template[]));
  }

  getTemplateById(id: number): Observable<Template> {
    return from(this.dbService.getByKey(this.STORE_NAME, id))
      .pipe(map(template => template as Template));
  }

  createTemplate(template: PromptTemplate): Observable<Template> {
    const newTemplate: Template = {
      ...template,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return from(this.dbService.add(this.STORE_NAME, newTemplate))
      .pipe(
        map(template => template as Template),
        tap(() => this.loadTemplates())
      );
  }

  updateTemplate(id: number, template: Partial<Template>): Observable<Template> {
    const updatedTemplate: Partial<Template> = {
      ...template,
      updatedAt: new Date()
    };
    return from(this.dbService.update(this.STORE_NAME, { ...updatedTemplate, id }))
      .pipe(
        map(template => template as Template),
        tap(() => this.loadTemplates())
      );
  }

  deleteTemplate(id: number): Observable<boolean> {
    return from(this.dbService.delete(this.STORE_NAME, id))
      .pipe(
        map(() => true),
        tap(() => this.loadTemplates())
      );
  }
}
