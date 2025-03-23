import {
  Component,
  inject,
  signal,
  computed,
  effect,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Language, CEFRLevel } from '../../models/preferences.model';
import { CloneSourceType, ClonePromptConfig } from '../../models/clone.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { ClipboardService } from '../../services/clipboard.service';
import { LanguageService } from '../../services/language.service';
import { ScrollService } from '../../shared/services/scroll.service';

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
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.scss'],
})
export class CloneComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptTemplateService);
  private readonly scrollService = inject(ScrollService);
  private readonly clipboardService = inject(ClipboardService);
  private readonly languageService = inject(LanguageService);

  form: FormGroup;
  readonly sourceTypes: CloneSourceType[] = [
    'screenshot',
    'docx',
    'pdf',
    'copied-text',
  ];
  readonly languages: Language[] = [
    'English',
    'español',
    'français',
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
    'C1+',
    'C2',
  ];
  readonly _generatedPrompt = signal<string>('');
  readonly generatedPrompt = computed(() => this._generatedPrompt());

  readonly _isEditMode = signal(false);
  readonly isEditMode = computed(() => this._isEditMode());

  readonly _editedPrompt = signal<string | null>(null);
  readonly editedPrompt = computed(() => this._editedPrompt());

  editablePrompt: string = '';

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
      newContext: [''],
      situationalContext: [''],
      situationalContextIsDialog: [false],
    });

    // Create an effect to handle scrolling when prompt changes
    effect(() => {
      if (this._generatedPrompt()) {
        setTimeout(() => {
          if (this.promptContainer?.nativeElement) {
            this.scrollService.scrollToBottom(
              this.promptContainer.nativeElement,
              20
            );
          }
        }, 100);
      }
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

  toggleEditMode(): void {
    const currentEditMode = this._isEditMode();
    this._isEditMode.set(!currentEditMode);

    if (!currentEditMode) {
      // Entering edit mode - initialize the editable content
      this.editablePrompt = this._editedPrompt() || this._generatedPrompt();
    } else {
      // Exiting edit mode - save the edited content
      this._editedPrompt.set(this.editablePrompt);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: ClonePromptConfig & { newContext?: string } = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        sourceType: formValue.sourceType!,
        situationalContext: formValue.situationalContext,
        isDialog: formValue.situationalContextIsDialog,
        newContext: formValue.newContext,
      };

      this._generatedPrompt.set(this.promptService.generateClonePrompt(config));
    }
  }
}
