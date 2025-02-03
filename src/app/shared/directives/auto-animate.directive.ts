import { Directive, ElementRef, OnInit } from '@angular/core';
import autoAnimate from '@formkit/auto-animate';

@Directive({
  selector: '[auto-animate]',
  standalone: true,
})
export class AutoAnimateDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    autoAnimate(this.el.nativeElement);
  }
}
