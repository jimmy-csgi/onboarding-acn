import { Injectable } from '@angular/core';
import { parseAcnModelValue, validateAcn } from '../../../shared/acn';

@Injectable({ providedIn: 'root' })
export class AcnService {
  parseModelDigits(raw: string): string {
    return parseAcnModelValue(raw);
  }

  isValidAcn(nineDigitString: string): boolean {
    return validateAcn(nineDigitString);
  }
}
