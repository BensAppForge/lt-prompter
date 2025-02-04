import { Component, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { signal } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import autoAnimate from '@formkit/auto-animate';

import {
  VocabularyPromptConfig,
  Language,
  VocabularyWord,
  CefrLevel,
} from '../../models/vocabulary.model';
import { PromptTemplateService } from '../../services/prompt-template.service';

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    RouterModule,
  ],
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss'],
})
export class VocabularyComponent {
  private readonly promptTemplateService = inject(PromptTemplateService);
  private readonly parent = inject(ElementRef);

  public readonly separatorKeysCodes = [ENTER, COMMA] as const;

  public readonly form: FormGroup;
  public readonly generatedPrompt = signal<string>('');
  public readonly copySuccess = signal(false);
  public readonly copyError = signal(false);

  public readonly languages: readonly Language[] = [
    'English',
    'Français',
    'Español',
    'Italiano',
  ] as const;

  public readonly cefrLevels: readonly CefrLevel[] = [
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'C2',
  ] as const;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      words: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      situationalContext: [''],
      situationalContextIsDialog: [false],
    });
  }

  ngAfterViewInit() {
    // Enable auto-animate on the chip grid
    const chipContainer = this.parent.nativeElement.querySelector('.chip-container');
    if (chipContainer) {
      autoAnimate(chipContainer);
    }
  }

  public get words(): FormArray {
    return this.form.get('words') as FormArray;
  }

  public addWordFromInput(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const wordGroup = this.createWordFormGroup();
      wordGroup.get('word')?.setValue(value);
      this.words.push(wordGroup);
    }
    event.chipInput!.clear();
  }

  public removeWord(index: number): void {
    this.words.removeAt(index);
  }

  public async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        this.showCopyFeedback(true);
      } else {
        await this.fallbackCopyToClipboard(text);
        this.showCopyFeedback(true);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      this.showCopyFeedback(false);
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const config: VocabularyPromptConfig = {
        targetLanguage: formValue.targetLanguage,
        cefr: formValue.cefr,
        words: formValue.words,
        situationalContext: formValue.situationalContext,
        situationalContextIsDialog: formValue.situationalContextIsDialog,
      };

      this.generatedPrompt.set(
        this.promptTemplateService.generateVocabularyPrompt(
          config,
          formValue.targetLanguage // Use target language for the prompt
        )
      );
    }
  }

  public navigateToDashboard(): void {
    // Using Router directly instead of browser history
    window.location.href = '/dashboard';
  }

  private createWordFormGroup(): FormGroup {
    return this.fb.group({
      word: ['', Validators.required],
    });
  }

  private atLeastOneInputValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const words = control.get('words') as FormArray;
    const hasWords =
      words.length > 0 &&
      words.controls.some((ctrl) => ctrl.get('word')?.value?.trim());

    if (!hasWords) {
      return { noWords: true };
    }

    return null;
  }

  private async fallbackCopyToClipboard(text: string): Promise<void> {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make it invisible but keep it in the viewport for iOS
    Object.assign(textArea.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '1px',
      height: '1px',
      padding: '0',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent',
    });

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      textArea.remove();
    } catch (err) {
      console.error('Fallback: Unable to copy', err);
      textArea.remove();
      throw new Error('Copy failed');
    }
  }

  private showCopyFeedback(success: boolean): void {
    if (success) {
      this.copySuccess.set(true);
      this.copyError.set(false);
    } else {
      this.copySuccess.set(false);
      this.copyError.set(true);
    }

    setTimeout(() => {
      if (success) {
        this.copySuccess.set(false);
      } else {
        this.copyError.set(false);
      }
    }, 2000);
  }
}
