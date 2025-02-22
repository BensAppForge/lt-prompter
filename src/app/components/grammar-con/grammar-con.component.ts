import { Component, computed, inject, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Language, CEFRLevel } from '../../models/preferences.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ScrollService } from '../../shared/services/scroll.service';
import { GrammarPromptConfig, GrammarPhenomenon } from '../../models/grammar.model';

interface GrammarFormValue {
  targetLanguage: Language;
  cefr: CEFRLevel;
  phenomena: PhenomenonForm[];
  situationalContext: string;
  situationalContextIsDialog: boolean;
}

interface PhenomenonForm {
  description: string;
  hint: string;
}

@Component({
  selector: 'app-grammar-con',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ClipboardModule,
    AutoAnimateDirective,
  ],
  templateUrl: './grammar-con.component.html',
  styleUrls: ['./grammar-con.component.scss'],
})
export class GrammarConComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptTemplateService);
  private readonly clipboard = inject(Clipboard);
  private readonly scrollService = inject(ScrollService);

  private readonly languageMap: Record<Language, string> = {
    'English': 'en-EN',
    'français': 'fr-FR',
    'español': 'es-ES',
    'italiano': 'it-IT'
  } as const;

  getLanguageCode(language: Language | null | undefined): string {
    if (!language) return 'en-EN';
    return this.languageMap[language] || 'en-EN';
  }

  readonly form: FormGroup;
  readonly languages: Language[] = [
    'English',
    'français',
    'español',
    'italiano',
  ];
  readonly cefrLevels: CEFRLevel[] = [
    'A1',
    'A1+',
    'A2',
    'A2+',
    'B1',
    'B1+',
    'B2',
    'B2+',
    'C1',
  ];

  private readonly _generatedPrompt = signal<string>('');
  readonly generatedPrompt = computed(() => this._generatedPrompt());

  private readonly _copyStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly copyStatus = computed(() => this._copyStatus());

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      phenomena: this.fb.array<PhenomenonForm>([], [
        Validators.required,
        Validators.minLength(1),
      ]),
      situationalContext: [''],
      situationalContextIsDialog: [false],
    });

    effect(() => {
      if (this._generatedPrompt()) {
        setTimeout(() => {
          if (this.promptContainer?.nativeElement) {
            this.scrollService.scrollToBottom(this.promptContainer.nativeElement, 20);
          }
        }, 100);
      }
    });
  }

  get phenomena(): FormArray {
    return this.form.get('phenomena') as FormArray;
  }

  addPhenomenon(description: string, hint: string = ''): void {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) return;

    this.phenomena.push(
      this.fb.group({
        description: [trimmedDescription, Validators.required],
        hint: [hint.trim()],
      })
    );
  }

  removePhenomenon(index: number): void {
    this.phenomena.removeAt(index);
  }

  navigateToDashboard(): void {
    void this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue() as GrammarFormValue;
      const config: GrammarPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        phenomena: formValue.phenomena.map((p: PhenomenonForm) => ({
          description: p.description,
          hint: p.hint || undefined
        })),
        situationalContext: formValue.situationalContext,
        situationalContextIsDialog: formValue.situationalContextIsDialog,
      };

      const prompt = this.promptService.generateGrammarPrompt(config, formValue.targetLanguage);
      this._generatedPrompt.set(prompt);
    }
  }

  copyToClipboard(text: string): void {
    try {
      this.clipboard.copy(text);
      this._copyStatus.set('success');
      setTimeout(() => this._copyStatus.set('idle'), 2000);
    } catch (error) {
      this._copyStatus.set('error');
      setTimeout(() => this._copyStatus.set('idle'), 2000);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
