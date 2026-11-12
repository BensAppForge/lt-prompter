import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { of } from 'rxjs';

import { WordfieldComponent } from './wordfield.component';

describe('WordfieldComponent', () => {
  const SETTINGS_KEY = 'lt-prompter-settings';
  let component: WordfieldComponent;
  let fixture: ComponentFixture<WordfieldComponent>;

  const create = async (settings: Record<string, unknown> = {}) => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ themePreference: 'light', ...settings })
    );
    await TestBed.configureTestingModule({
      imports: [WordfieldComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: NgxIndexedDBService, useValue: { getAll: () => of([]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(WordfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const generate = (outputType: 'table' | 'markdown'): string => {
    component.form.patchValue({
      targetLanguage: 'English',
      cefr: 'B1',
      sourceType: 'pdf',
      outputType,
    });
    component.onSubmit();
    return component.generatedPrompt();
  };

  afterEach(() => localStorage.removeItem(SETTINGS_KEY));

  it('answers in the chat unless a file is chosen', async () => {
    await create();
    expect(component.outputFormat()).toBe('chat');
    expect(generate('table')).not.toContain('Output format:');
  });

  it('asks for the chosen file at the end of the prompt', async () => {
    await create();
    component.outputFormat.set('docx-pdf');
    const prompt = generate('table');
    expect(prompt).toContain('Output format:');
    expect(prompt).toContain('a Word document (.docx) and a PDF file');
  });

  it('starts from the default set on the settings page', async () => {
    await create({ defaultOutputFormat: 'pdf' });
    expect(component.outputFormat()).toBe('pdf');
    expect(generate('table')).toContain('downloadable PDF file');
  });

  it('ignores a default that is not a known format', async () => {
    await create({ defaultOutputFormat: 'odt' });
    expect(component.outputFormat()).toBe('chat');
  });

  it('never asks for a file when the result is mind-map markdown', async () => {
    await create({ defaultOutputFormat: 'pdf' });
    expect(generate('markdown')).not.toContain('Output format:');
  });

  it('saves the chosen format with the editor snapshot', async () => {
    await create();
    const dialog = fixture.debugElement.injector.get(MatDialog);
    const open = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(undefined),
    } as ReturnType<MatDialog['open']>);

    component.outputFormat.set('docx');
    generate('table');
    // Changed afterwards without regenerating
    component.outputFormat.set('pdf');
    component.saveToLibrary();

    const data = open.calls.mostRecent().args[1]?.data as {
      content: string;
      editorConfig: { state: { outputFormat: string } };
    };
    expect(data.editorConfig.state.outputFormat).toBe('docx');
    expect(data.content).toContain('Word document (.docx)');
  });
});
