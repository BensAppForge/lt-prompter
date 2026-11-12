import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { of } from 'rxjs';

import { PersonaComponent } from './persona.component';

describe('PersonaComponent', () => {
  const SETTINGS_KEY = 'lt-prompter-settings';
  let component: PersonaComponent;
  let fixture: ComponentFixture<PersonaComponent>;

  const create = async (editorState?: Record<string, unknown>) => {
    // A file default must not leak into a chat prompt
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ themePreference: 'light', defaultOutputFormat: 'pdf' })
    );
    history.replaceState(
      editorState
        ? { editorConfig: { route: '/persona', state: editorState } }
        : {},
      ''
    );
    await TestBed.configureTestingModule({
      imports: [PersonaComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: NgxIndexedDBService, useValue: { getAll: () => of([]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    localStorage.removeItem(SETTINGS_KEY);
    history.replaceState({}, '');
  });

  it('needs a language, a level and a persona', async () => {
    await create();
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ targetLanguage: 'italiano', cefr: 'A2' });
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ persona: '   ' });
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ persona: 'Leonardo da Vinci' });
    expect(component.form.valid).toBeTrue();
  });

  it('generates a chat prompt without a file request', async () => {
    await create();
    component.form.patchValue({
      targetLanguage: 'italiano',
      cefr: 'A2',
      persona: 'Leonardo da Vinci',
    });
    component.maxSentences.set(3);
    component.limitTurns.set(true);
    component.turnLimit.set(8);
    component.onSubmit();

    const prompt = component.generatedPrompt();
    expect(prompt).toContain('vesti i panni di Leonardo da Vinci');
    expect(prompt).toContain('al massimo 3 frasi');
    expect(prompt).toContain('Dopo circa 8 messaggi');
    expect(prompt).toContain('Il passato remoto è escluso');
    expect(prompt).not.toContain('Formato di output');
  });

  it('offers the literary-tense switch only for Italian and French', async () => {
    await create();
    expect(component.literaryTense()).toBeNull();
    component.form.patchValue({ targetLanguage: 'español' });
    expect(component.literaryTense()).toBeNull();
    component.form.patchValue({ targetLanguage: 'français' });
    expect(component.literaryTense()?.tense).toBe('Passé simple');
  });

  it('saves under the persona category with a restorable snapshot', async () => {
    await create();
    const dialog = fixture.debugElement.injector.get(MatDialog);
    const open = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(undefined),
    } as ReturnType<MatDialog['open']>);
    component.form.patchValue({
      targetLanguage: 'italiano',
      cefr: 'A2',
      persona: ' Leonardo  da Vinci ',
    });
    component.onSubmit();
    component.saveToLibrary();

    const data = open.calls.mostRecent().args[1]?.data as {
      category: string;
      name: string;
      editorConfig: { route: string; state: Record<string, unknown> };
    };
    expect(data.category).toBe('persona');
    expect(data.name).toBe('Persona-Chat - Leonardo da Vinci');
    expect(data.editorConfig.route).toBe('/persona');
    expect(data.editorConfig.state['maxSentences']).toBe(4);
    expect(data.editorConfig.state['outputFormat']).toBeUndefined();
  });

  it('restores a saved snapshot and ignores malformed parts of it', async () => {
    await create({
      form: {
        targetLanguage: 'français',
        cefr: 'B1',
        personaType: 'everyday',
        persona: 'Camille',
        conversationStyle: 'nonsense',
        closingSummary: 'yes',
        topics: 42,
      },
      maxSentences: 6,
      limitTurns: true,
      turnLimit: 999,
    });
    const value = component.form.getRawValue();
    expect(value.targetLanguage).toBe('français');
    expect(value.personaType).toBe('everyday');
    expect(value.persona).toBe('Camille');
    expect(value.conversationStyle).toBe('interview');
    expect(value.closingSummary).toBeTrue();
    expect(value.topics).toBe('');
    expect(component.maxSentences()).toBe(6);
    expect(component.limitTurns()).toBeTrue();
    expect(component.turnLimit()).toBe(12);
  });
});
