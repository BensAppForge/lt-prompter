import { Injectable, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private readonly clipboard = inject(Clipboard);

  /**
   * Copies text to clipboard using the native API with CDK fallback.
   * Returns true on success, false on failure.
   */
  async copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return this.clipboard.copy(text);
    } catch {
      return this.clipboard.copy(text);
    }
  }
}
