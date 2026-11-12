import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { of } from 'rxjs';

import { ComprehensionComponent } from './comprehension.component';

describe('ComprehensionComponent', () => {
  let component: ComprehensionComponent;
  let fixture: ComponentFixture<ComprehensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensionComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: NgxIndexedDBService, useValue: { getAll: () => of([]) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprehensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires at least two exercise types', () => {
    component.form.patchValue({
      targetLanguage: 'English',
      cefr: 'A2',
      sourceType: 'pdf',
      exercises: ['true-false'],
    });
    expect(component.form.valid).toBeFalse();

    component.form.patchValue({ exercises: ['true-false', 'matching'] });
    expect(component.form.valid).toBeTrue();
  });
});
