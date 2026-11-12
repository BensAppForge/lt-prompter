import { Language } from '../models/preferences.model';
import { OutputFormat } from '../models/output-format.model';

type FileFormat = Exclude<OutputFormat, 'chat'>;

interface OutputFormatParts {
  heading: string;
  /** Which file(s) to create. */
  request: Record<FileFormat, string>;
  /** Make it a real, print-ready file rather than a description of one. */
  layout: string;
  /** Not every AI tool can create files — ask for a usable fallback. */
  fallback: string;
}

/**
 * Tool-neutral instructions that make the AI deliver the material as a
 * downloadable file. Written in the prompt's language, like every template.
 */
export const outputFormatParts: Record<Language, OutputFormatParts> = {
  English: {
    heading: 'Output format:',
    request: {
      docx: 'Provide the finished material as a downloadable Word document (.docx).',
      pdf: 'Provide the finished material as a downloadable PDF file.',
      'docx-pdf':
        'Provide the finished material as two downloadable files with identical content: a Word document (.docx) and a PDF file.',
    },
    layout:
      "Each requested file must really be created – do not merely describe it or print its content as text or code in the chat. Lay the material out ready to print, with clear headings and enough space for the students' answers. If the material includes an answer key, put it on a separate page at the end.",
    fallback:
      'If you cannot create files in this environment, say so in one sentence and output the material in the chat as cleanly formatted, print-ready text instead.',
  },
  français: {
    heading: 'Format de sortie :',
    request: {
      docx: "Fournissez le matériel terminé sous la forme d'un document Word (.docx) téléchargeable.",
      pdf: "Fournissez le matériel terminé sous la forme d'un fichier PDF téléchargeable.",
      'docx-pdf':
        'Fournissez le matériel terminé sous la forme de deux fichiers téléchargeables au contenu identique : un document Word (.docx) et un fichier PDF.',
    },
    layout:
      "Chaque fichier demandé doit réellement être créé – ne vous contentez pas de le décrire ni d'afficher son contenu sous forme de texte ou de code dans la conversation. Mettez le matériel en page pour l'impression, avec des titres clairs et suffisamment de place pour les réponses des élèves. Si le matériel comporte un corrigé, placez-le sur une page séparée à la fin.",
    fallback:
      'Si vous ne pouvez pas créer de fichiers dans cet environnement, indiquez-le en une phrase et présentez à la place le matériel dans la conversation, sous forme de texte soigneusement mis en forme et prêt à imprimer.',
  },
  español: {
    heading: 'Formato de salida:',
    request: {
      docx: 'Entrega el material terminado como un documento de Word (.docx) descargable.',
      pdf: 'Entrega el material terminado como un archivo PDF descargable.',
      'docx-pdf':
        'Entrega el material terminado como dos archivos descargables con contenido idéntico: un documento de Word (.docx) y un archivo PDF.',
    },
    layout:
      'Cada archivo solicitado debe crearse realmente; no te limites a describirlo ni a mostrar su contenido como texto o código en el chat. Maqueta el material listo para imprimir, con títulos claros y espacio suficiente para las respuestas de los alumnos. Si el material incluye una clave de respuestas, colócala en una página aparte al final.',
    fallback:
      'Si no puedes crear archivos en este entorno, dilo en una frase y, en su lugar, presenta el material en el chat como texto bien formateado y listo para imprimir.',
  },
  italiano: {
    heading: 'Formato di output:',
    request: {
      docx: 'Fornisci il materiale finito come documento Word (.docx) scaricabile.',
      pdf: 'Fornisci il materiale finito come file PDF scaricabile.',
      'docx-pdf':
        'Fornisci il materiale finito come due file scaricabili con contenuto identico: un documento Word (.docx) e un file PDF.',
    },
    layout:
      'Ogni file richiesto deve essere creato davvero: non limitarti a descriverlo o a mostrarne il contenuto come testo o codice nella chat. Impagina il materiale pronto per la stampa, con titoli chiari e spazio sufficiente per le risposte degli studenti. Se il materiale comprende le soluzioni, mettile su una pagina separata alla fine.',
    fallback:
      'Se in questo ambiente non puoi creare file, dillo in una frase e presenta invece il materiale nella chat come testo ben formattato e pronto per la stampa.',
  },
};

/**
 * Appends the file-output block to a finished prompt. `chat` leaves the
 * prompt untouched — the AI tool then answers in the conversation as before.
 */
export function appendOutputFormat(
  prompt: string,
  language: Language,
  format: OutputFormat
): string {
  if (format === 'chat') return prompt;
  const parts = outputFormatParts[language];
  if (!parts) return prompt;
  return [
    prompt.trimEnd(),
    '',
    parts.heading,
    parts.request[format],
    parts.layout,
    parts.fallback,
  ].join('\n');
}
