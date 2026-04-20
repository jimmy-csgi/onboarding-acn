import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcnDigitsOnlyDirective } from './acn-digits-only.directive';
import {
  formatAcnDisplay,
  formatDigitsWithAcnSpacing,
  isNineDigitAcn,
  parseAcnModelValue,
  validateAcn,
} from './acn';

type AcnValidationState = 'idle' | 'incomplete' | 'valid' | 'invalid';

@Component({
  selector: 'app-root',
  imports: [FormsModule, AcnDigitsOnlyDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly digits = signal('');

  protected readonly displayValue = computed(() => formatDigitsWithAcnSpacing(this.digits()));

  protected readonly status = computed((): AcnValidationState => {
    const d = this.digits();
    if (!d) {
      return 'idle';
    }
    if (!isNineDigitAcn(d)) {
      return 'incomplete';
    }
    return validateAcn(d) ? 'valid' : 'invalid';
  });

  protected readonly validDisplay = computed(() => {
    const d = this.digits();
    return isNineDigitAcn(d) ? formatAcnDisplay(d) : formatDigitsWithAcnSpacing(this.digits());
  });

  protected onChange(raw: string): void {
    this.digits.set(parseAcnModelValue(raw));
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') ?? '';
    const merged = this.digits() + pastedText;
    this.digits.set(parseAcnModelValue(merged));
  }
}
