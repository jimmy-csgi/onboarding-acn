import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNineDigitAcn, normalizeAcnInput, validateAcn } from '../../../shared/acn';

/** Runs on every value change — drives live messages like the old <code>computed(status)</code>. */
export function acnLiveValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const n = normalizeAcnInput(control.value ?? '');
    if (!n) {
      return null;
    }
    if (!isNineDigitAcn(n)) {
      return { incomplete: true };
    }
    if (!validateAcn(n)) {
      return { checksum: true };
    }
    return null;
  };
}
