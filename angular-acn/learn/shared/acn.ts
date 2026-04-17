/** Strip grouping spaces; keep digits only. */
export function normalizeAcnInput(input: string): string {
  return (input ?? '').replace(/\s/g, '');
}

/** Value stored in the model / state: ASCII digits only, at most 9 characters. */
export function parseAcnModelValue(rawInput: string | null | undefined): string {
  return String(rawInput ?? '')
    .replace(/\D/g, '')
    .substring(0, 9);
}

/** True if the string is exactly nine ASCII digits. */
export function isNineDigitAcn(value: string): boolean {
  return /^\d{9}$/.test(value);
}

/**
 * Validates an Australian Company Number (nine digits, last is check digit).
 * Spaces are not part of the ACN — normalize before calling.
 */
export function validateAcn(nineDigits: string): boolean {
  if (!isNineDigitAcn(nineDigits)) {
    return false;
  }
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += Number(nineDigits[i]) * weights[i];
  }
  const remainder = sum % 10;
  let expectedCheckDigit = 10 - remainder;
  if (expectedCheckDigit === 10) {
    expectedCheckDigit = 0;
  }
  return expectedCheckDigit === Number(nineDigits[8]);
}

/** ASIC display convention: nnn nnn nnn (spaces are not part of the ACN). */
export function formatAcnDisplay(nineDigits: string): string {
  if (!isNineDigitAcn(nineDigits)) {
    return nineDigits;
  }
  return `${nineDigits.slice(0, 3)} ${nineDigits.slice(3, 6)} ${nineDigits.slice(6, 9)}`;
}
