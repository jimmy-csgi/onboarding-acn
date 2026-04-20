export function normalizeAcnInput(input: string): string {
  return (input ?? '').replace(/\s/g, '');
}

export function parseAcnModelValue(rawInput: string | null | undefined): string {
  return String(rawInput ?? '')
    .replace(/\D/g, '')
    .substring(0, 9);
}

export function isNineDigitAcn(value: string): boolean {
  return /^\d{9}$/.test(value);
}

export function validateAcn(nineDigits: string): boolean {
  if (!isNineDigitAcn(nineDigits)) {
    return false;
  }
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  let weightedSum = 0;
  for (let i = 0; i < 8; i++) {
    weightedSum += Number(nineDigits[i]) * weights[i];
  }
  const remainder = weightedSum % 10;
  let expectedCheckDigit = 10 - remainder;
  if (expectedCheckDigit === 10) {
    expectedCheckDigit = 0;
  }
  return expectedCheckDigit === Number(nineDigits[8]);
}

export function formatAcnDisplay(nineDigits: string): string {
  if (!isNineDigitAcn(nineDigits)) {
    return nineDigits;
  }
  return `${nineDigits.slice(0, 3)} ${nineDigits.slice(3, 6)} ${nineDigits.slice(6, 9)}`;
}

/** Inserts ASIC-style spaces while the user types (partial digit strings). */
export function formatDigitsWithAcnSpacing(rawDigits: string | null | undefined): string {
  const digitsOnly = parseAcnModelValue(rawDigits);
  if (!digitsOnly) {
    return '';
  }
  if (digitsOnly.length <= 3) {
    return digitsOnly;
  }
  if (digitsOnly.length <= 6) {
    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
  }
  return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)}`;
}
