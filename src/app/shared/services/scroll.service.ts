import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private ngZone: NgZone) {}

  scrollToBottom(element: HTMLElement, offset: number = 0): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // Get the element's position relative to the viewport
        const rect = element.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top;
        
        // Calculate target scroll position
        const targetPosition = absoluteTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 150); // Slightly longer delay to ensure content is rendered
    });
  }
}
