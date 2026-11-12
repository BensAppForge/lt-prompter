/** How the AI tool should deliver the finished material. */
export type OutputFormat = 'chat' | 'docx' | 'pdf' | 'docx-pdf';

export const OUTPUT_FORMATS: readonly { value: OutputFormat; label: string }[] =
  [
    { value: 'chat', label: 'Keine Datei (Antwort im Chat)' },
    { value: 'docx', label: 'Word-Datei (.docx)' },
    { value: 'pdf', label: 'PDF-Datei' },
    { value: 'docx-pdf', label: 'Word- und PDF-Datei' },
  ];

export function isOutputFormat(value: unknown): value is OutputFormat {
  return OUTPUT_FORMATS.some((format) => format.value === value);
}
