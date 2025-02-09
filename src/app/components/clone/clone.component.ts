import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Language, CEFRLevel } from '../../models/preferences.model';
import { CloneSourceType } from '../../models/clone.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { ClipboardService } from '../../services/clipboard.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-clone',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.scss']
})
export class CloneComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private promptService = inject(PromptTemplateService);
  private clipboardService = inject(ClipboardService);
  private languageService = inject(LanguageService);

  form: FormGroup;
  languages: Language[] = ['English', 'español', 'français', 'italiano'];
  cefrLevels: CEFRLevel[] = [
    'A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'
  ];
  generatedPrompt = signal<string>('');

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
      newContext: ['']
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  getLanguageCode(language: Language): string {
    return this.languageService.getLanguageCode(language);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  copyToClipboard(text: string): void {
    this.clipboardService.copyToClipboard(text);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const prompt = this.promptService.generateClonePrompt({
        targetLanguage: formValue.targetLanguage as Language,
        cefr: formValue.cefr as CEFRLevel,
        sourceType: formValue.sourceType as CloneSourceType,
        newContext: formValue.newContext
      });
      this.generatedPrompt.set(prompt);
    }
  }
}
