import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AcnService } from './acn.service';

/** Full ACN check (length + checksum). Use with `FormGroup` / `FormControl` `updateOn: 'submit'` for “Check” UX. */
export function acnSubmitValidator(acnService: AcnService): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const digits = acnService.parseModelDigits(control.value ?? '');
    if (digits.length !== 9) {
      return { acnIncomplete: true };
    }
    return acnService.isValidAcn(digits) ? null : { acnChecksum: true };
  };
}
