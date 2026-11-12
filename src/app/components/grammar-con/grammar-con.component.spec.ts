import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { of } from 'rxjs';

import { GrammarConComponent } from './grammar-con.component';

describe('GrammarConComponent', () => {
  let component: GrammarConComponent;
  let fixture: ComponentFixture<GrammarConComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrammarConComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        // Empty library: the save dialog only reads the collection names
        { provide: NgxIndexedDBService, useValue: { getAll: () => of([]) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('generates a prompt from the form', () => {
    component.form.patchValue({ targetLanguage: 'English', cefr: 'B1' });
    component.addPhenomenon('past tense', 'regular verbs');
    component.onSubmit();

    expect(component.generatedPrompt()).toContain('- past tense (regular verbs)');
    expect(component.generatedPrompt()).toContain('B1');
  });

  it('saves the settings the prompt was generated with, not later form changes', () => {
    // The component gets its own MatDialog through its MatDialogModule import
    const dialog = fixture.debugElement.injector.get(MatDialog);
    const open = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(undefined),
    } as ReturnType<MatDialog['open']>);

    component.form.patchValue({ targetLanguage: 'English', cefr: 'B1' });
    component.addPhenomenon('past tense');
    component.onSubmit();

    // Changed afterwards without regenerating
    component.form.patchValue({ targetLanguage: 'français', cefr: 'C1' });
    component.addPhenomenon('subjonctif');
    component.saveToLibrary();

    const data = open.calls.mostRecent().args[1]?.data as {
      targetLanguage: string;
      cefr: string;
      name: string;
      content: string;
      editorConfig: { state: { form: { targetLanguage: string } } };
    };
    expect(data.targetLanguage).toBe('English');
    expect(data.cefr).toBe('B1');
    expect(data.name).toBe('Grammatik - past tense');
    expect(data.editorConfig.state.form.targetLanguage).toBe('English');
    expect(data.content).toBe(component.generatedPrompt());
  });
});
