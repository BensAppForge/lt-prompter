import { Component, inject, ViewChild, ElementRef, effect, signal, computed } from '@angular/core';
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
  COMPREHENSION_EXERCISE_TYPES,
  SOURCE_TYPES,
  ComprehensionPromptConfig
} from '../../models/comprehension.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { ClipboardService } from '../../services/clipboard.service';
import { ScrollService } from '../../shared/services/scroll.service';

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
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptTemplateService);
  private readonly clipboardService = inject(ClipboardService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly scrollService = inject(ScrollService);

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

  readonly exerciseTypes = COMPREHENSION_EXERCISE_TYPES;
  readonly sourceTypes = SOURCE_TYPES;
  readonly _generatedPrompt = signal<string>('');
  readonly generatedPrompt = computed(() => this._generatedPrompt());

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      exercises: [[], [Validators.required, Validators.minLength(2)]],
      sourceType: ['', Validators.required],
      situationalContext: [''],
      situationalContextIsDialog: [false],
    });

    // Create an effect to handle scrolling when prompt changes
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

  navigateToDashboard(): void {
    this.router.navigate(['/']);
  }

  isExerciseTypeSelected(type: ComprehensionExerciseType): boolean {
    const exercises = this.form.get('exercises')?.value as ComprehensionExerciseType[];
    return exercises?.includes(type) ?? false;
  }

  onExerciseTypeChange(event: { checked: boolean }, type: ComprehensionExerciseType): void {
    const exercises = (this.form.get('exercises')?.value as ComprehensionExerciseType[]) || [];
    
    if (event.checked && !exercises.includes(type)) {
      this.form.patchValue({
        exercises: [...exercises, type]
      });
    } else if (!event.checked && exercises.includes(type)) {
      this.form.patchValue({
        exercises: exercises.filter(t => t !== type)
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: ComprehensionPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        exercises: formValue.exercises!,
        sourceType: formValue.sourceType!,
        situationalContext: formValue.situationalContext,
        isDialog: formValue.situationalContextIsDialog,
      };

      this._generatedPrompt.set(
        this.promptService.generateComprehensionPrompt(config)
      );
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
    return lang === 'English' ? lang : lang.charAt(0).toUpperCase() + lang.slice(1);
  }
}
