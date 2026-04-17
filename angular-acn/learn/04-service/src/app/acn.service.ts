import { Injectable } from '@angular/core';
import { normalizeAcnInput, parseAcnModelValue } from '../../../shared/acn';

@Injectable({ providedIn: 'root' })
export class AcnService {
  normalize(input: string): string {
    return normalizeAcnInput(input);
  }

  parseModelDigits(raw: string): string {
    return parseAcnModelValue(raw);
  }
}
