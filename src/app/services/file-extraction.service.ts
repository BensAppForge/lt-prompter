import { Injectable } from '@angular/core';

export interface FileExtractionResult {
  text: string;
  pageCount?: number;
}

@Injectable({ providedIn: 'root' })
export class FileExtractionService {
  private pdfjsModulePromise?: Promise<typeof import('pdfjs-dist')>;
  private mammothModulePromise?: Promise<typeof import('mammoth')>;

  async extractFromPdf(file: File): Promise<FileExtractionResult> {
    const pdfjs = await this.loadPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const pageTexts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (pageText) {
        pageTexts.push(pageText);
      }
    }

    return {
      text: pageTexts.join('\n\n').trim(),
      pageCount: doc.numPages,
    };
  }

  async extractFromDocx(file: File): Promise<FileExtractionResult> {
    const mammoth = await this.loadMammoth();
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value.trim() };
  }

  private async loadPdfjs(): Promise<typeof import('pdfjs-dist')> {
    if (!this.pdfjsModulePromise) {
      this.pdfjsModulePromise = import('pdfjs-dist').then((mod) => {
        mod.GlobalWorkerOptions.workerSrc = new URL(
          'pdf.worker.min.mjs',
          document.baseURI
        ).toString();
        return mod;
      });
    }
    return this.pdfjsModulePromise;
  }

  private async loadMammoth(): Promise<typeof import('mammoth')> {
    if (!this.mammothModulePromise) {
      this.mammothModulePromise = import('mammoth');
    }
    return this.mammothModulePromise;
  }
}
