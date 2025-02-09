import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language, CEFRLevel } from '../../models/preferences.model';
import {
  ComprehensionExerciseType,
  ComprehensionSourceType,
} from '../../models/comprehension.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { ClipboardService } from '../../services/clipboard.service';

@Component({
  selector: 'app-comprehension',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss'],
})
export class ComprehensionComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private promptService = inject(PromptTemplateService);
  private clipboardService = inject(ClipboardService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  languages: Language[] = ['English', 'español', 'français', 'italiano'];
  cefrLevels: CEFRLevel[] = [
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
  exerciseTypes: ComprehensionExerciseType[] = [
    'true-false',
    'multiple-choice',
    'matching',
    'gapped-summary',
  ];
  sourceTypes: ComprehensionSourceType[] = [
    'screenshot',
    'docx',
    'pdf',
    'copied-text',
  ];

  generatedPrompt = '';
  selectedExerciseTypes: string[] = [];

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      exerciseTypes: [[], [Validators.required, Validators.minLength(2)]],
      sourceType: ['', Validators.required],
    });
  }

  navigateToDashboard(): void {
    this.router.navigate(['/']);
  }

  onExerciseTypeChange(event: any, type: string): void {
    const exerciseTypes = this.form.get('exerciseTypes')?.value || [];
    if (event.checked) {
      exerciseTypes.push(type);
    } else {
      const index = exerciseTypes.indexOf(type);
      if (index > -1) {
        exerciseTypes.splice(index, 1);
      }
    }
    this.form.patchValue({ exerciseTypes });
  }

  isExerciseTypeSelected(type: string): boolean {
    return (this.form.get('exerciseTypes')?.value || []).includes(type);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const prompt = this.promptService.generateComprehensionPrompt({
        targetLanguage: this.form.value.targetLanguage,
        cefr: this.form.value.cefr,
        exercises: this.form.value.exerciseTypes,
        sourceType: this.form.value.sourceType,
      });
      this.generatedPrompt = prompt;
    }
  }

  copyToClipboard(text: string): void {
    this.clipboardService.copyToClipboard(text);
    this.snackBar.open('In die Zwischenablage kopiert', 'OK', {
      duration: 2000,
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  displayLanguage(lang: Language): string {
    return lang === 'English' ? lang : lang.toLowerCase();
  }
}
