import { Directive, HostListener } from '@angular/core';

const NAV_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

/** Blocks non-digit keys (navigation keys allowed). Paste is not handled here. */
@Directive({
  selector: '[appAcnDigitsOnly]',
  standalone: true,
})
export class AcnDigitsOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    if (NAV_KEYS.has(event.key)) {
      return;
    }
    if (event.key.length === 1 && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  }
}
