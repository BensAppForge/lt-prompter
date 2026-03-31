import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { LibraryPrompt, PromptCategory } from '../../../models/library.model';
import { Language, CEFRLevel } from '../../../models/preferences.model';

export interface SaveToLibraryDialogData {
  category: PromptCategory;
  targetLanguage: Language;
  cefr: CEFRLevel;
  content: string;
  name?: string;
  description?: string;
  tags?: string[];
}

@Component({
  selector: 'app-save-to-library-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.name ? 'Prompt bearbeiten' : 'Prompt speichern' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-fields">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Name</mat-label>
            <input
              matInput
              formControlName="name"
              placeholder="Geben Sie einen Namen ein"
            />
            @if (form.get('name')?.hasError('required')) {
              <mat-error>Name ist erforderlich</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Beschreibung</mat-label>
            <textarea
              matInput
              formControlName="description"
              rows="3"
              placeholder="Beschreiben Sie den Prompt"
            ></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tags</mat-label>
            <mat-chip-grid #chipGrid>
              @for (tag of tags; track tag) {
                <mat-chip-row (removed)="removeTag(tag)">
                  {{ tag }}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
              }
            </mat-chip-grid>
            <input
              placeholder="Neue Tags..."
              [matChipInputFor]="chipGrid"
              (matChipInputTokenEnd)="addTag($event)"
            />
          </mat-form-field>

          <div class="info-section">
            <h3>Prompt Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Kategorie:</span>
                <span class="value">{{ getCategoryLabel(data.category) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Sprache:</span>
                <span class="value">{{ data.targetLanguage }}</span>
              </div>
              <div class="info-item">
                <span class="label">CEFR Level:</span>
                <span class="value">{{ data.cefr }}</span>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Abbrechen</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="!form.valid"
          class="save-button"
        >
          Speichern
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form-fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .full-width {
        width: 100%;
      }

      .info-section {
        margin-top: 16px;
        padding: 16px;
        background-color: var(--surface-color);
        border-radius: 4px;

        h3 {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .value {
          font-size: 14px;
        }
      }

      mat-dialog-content {
        max-height: 80vh;
        overflow-y: auto;
      }

      mat-dialog-actions {
        padding: 16px 24px;
        margin: 0;

        .save-button {
          margin-left: 8px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveToLibraryDialogComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SaveToLibraryDialogComponent>);
  readonly data = inject<SaveToLibraryDialogData>(MAT_DIALOG_DATA);

  tags: string[] = [];
  form = this.fb.group({
    name: [this.data.name || '', Validators.required],
    description: [this.data.description || ''],
  });

  constructor() {
    this.tags = this.data.tags || [];
  }

  onSubmit(): void {
    if (this.form.valid) {
      const result: Partial<LibraryPrompt> = {
        name: this.form.get('name')?.value ?? undefined,
        description: this.form.get('description')?.value ?? undefined,
        tags: this.tags,
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
      event.chipInput!.clear();
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  getCategoryLabel(category: PromptCategory): string {
    const labels: Record<PromptCategory, string> = {
      vocabulary: 'Vokabeln',
      grammar: 'Grammatik',
      comprehension: 'Textverständnis',
      clone: 'Klon',
      wordfield: 'Wortfeld',
      korrektur: 'Korrektur',
    };
    return labels[category] || category;
  }
}
