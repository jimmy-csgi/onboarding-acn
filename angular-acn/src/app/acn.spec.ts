import { describe, expect, it } from 'vitest';
import {
  formatAcnDisplay,
  formatDigitsWithAcnSpacing,
  normalizeAcnInput,
  parseAcnModelValue,
  validateAcn,
} from './acn';

describe('ACN validation', () => {
  it('normalizes grouped and ungrouped input', () => {
    expect(normalizeAcnInput('004 085 616')).toBe('004085616');
    expect(normalizeAcnInput('004085616')).toBe('004085616');
    expect(normalizeAcnInput('  001 000 004  ')).toBe('001000004');
  });

  it('parseAcnModelValue keeps digits only and max nine', () => {
    expect(parseAcnModelValue('004 085 616')).toBe('004085616');
    expect(parseAcnModelValue('004-085-616')).toBe('004085616');
    expect(parseAcnModelValue('004085616999')).toBe('004085616');
  });

  it('validates the worked example 004 085 616', () => {
    expect(validateAcn('004085616')).toBe(true);
  });

  it('rejects wrong check digit', () => {
    expect(validateAcn('004085617')).toBe(false);
  });

  it('rejects non-nine-digit strings', () => {
    expect(validateAcn('00408561')).toBe(false);
    expect(validateAcn('0040856161')).toBe(false);
    expect(validateAcn('abcdabcde')).toBe(false);
  });

  it('accepts sample valid ACNs from the specification', () => {
    const samples = [
      '000000019',
      '000250000',
      '000500005',
      '000750005',
      '001000004',
      '001250004',
      '001500009',
      '001749999',
      '001999999',
      '002249998',
      '002499998',
      '002749993',
      '002999993',
      '003249992',
      '003499992',
      '003749988',
      '003999988',
      '004249987',
      '005499981',
      '005749986',
    ];
    for (const acn of samples) {
      expect(validateAcn(acn), acn).toBe(true);
    }
  });

  it('formats display with spaces', () => {
    expect(formatAcnDisplay('004085616')).toBe('004 085 616');
  });

  it('formatDigitsWithAcnSpacing groups while typing', () => {
    expect(formatDigitsWithAcnSpacing('')).toBe('');
    expect(formatDigitsWithAcnSpacing('004')).toBe('004');
    expect(formatDigitsWithAcnSpacing('0040')).toBe('004 0');
    expect(formatDigitsWithAcnSpacing('004085')).toBe('004 085');
    expect(formatDigitsWithAcnSpacing('004085616')).toBe('004 085 616');
    expect(formatDigitsWithAcnSpacing('004 085 616')).toBe('004 085 616');
  });
});
