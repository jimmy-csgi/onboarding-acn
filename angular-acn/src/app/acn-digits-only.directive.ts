import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { parseAcnModelValue } from './acn';

const NAVIGATION_KEYS = new Set([
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

function usesModifierShortcut(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey || event.altKey;
}

function isNavigationKey(key: string): boolean {
  return NAVIGATION_KEYS.has(key);
}

function digitCountInFieldText(fieldText: string): number {
  return parseAcnModelValue(fieldText).length;
}

function collapsedSelectionLength(input: HTMLInputElement): number {
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  return end - start;
}

@Directive({
  selector: '[appAcnDigitsOnly]',
  standalone: true,
})
export class AcnDigitsOnlyDirective {
  private readonly inputElement = inject(ElementRef<HTMLInputElement>);

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (usesModifierShortcut(event)) {
      return;
    }
    if (isNavigationKey(event.key)) {
      return;
    }
    if (event.key.length !== 1) {
      return;
    }
    if (!/\d/.test(event.key)) {
      event.preventDefault();
      return;
    }
    const input = this.inputElement.nativeElement;
    const alreadyHasNineDigits =
      digitCountInFieldText(input.value) >= 9 && collapsedSelectionLength(input) === 0;
    if (alreadyHasNineDigits) {
      event.preventDefault();
    }
  }
}
