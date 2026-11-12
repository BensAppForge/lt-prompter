import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
  OUTPUT_FORMATS,
  OutputFormat,
} from '../../../models/output-format.model';

/**
 * "Ausgabe als Datei" control shared by the exercise editors: lets the
 * teacher have the prompt ask the AI tool for a Word and/or PDF file.
 */
@Component({
  selector: 'app-output-format-field',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label>Ausgabe als Datei</mat-label>
      <mat-select
        [value]="value()"
        (selectionChange)="value.set($event.value)"
      >
        @for (format of formats; track format.value) {
          <mat-option [value]="format.value">{{ format.label }}</mat-option>
        }
      </mat-select>
      <mat-hint>
        @if (value() === 'chat') {
          Die KI antwortet im Chat. Wählen Sie ein Dateiformat, wenn der Prompt
          eine fertige Datei anfordern soll.
        } @else {
          Nicht jedes KI-Tool kann Dateien erstellen. Der Prompt bittet dann
          ersatzweise um druckfertigen Text im Chat.
        }
      </mat-hint>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 0 0 20px;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputFormatFieldComponent {
  readonly value = model<OutputFormat>('chat');
  readonly formats = OUTPUT_FORMATS;
}
