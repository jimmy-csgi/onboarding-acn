describe('acn', function () {
  let acn;

  beforeEach(function () {
    module('acnApp');
    inject(function (_acn_) {
      acn = _acn_;
    });
  });

  it('stripGroupingSpaces removes spaces', function () {
    expect(acn.stripGroupingSpaces('004 085 616')).toBe('004085616');
    expect(acn.stripGroupingSpaces('004085616')).toBe('004085616');
  });

  it('extractDigitsCappedAtNine strips non-digits and caps length', function () {
    expect(acn.extractDigitsCappedAtNine('004 085 616')).toBe('004085616');
    expect(acn.extractDigitsCappedAtNine('004-085-616')).toBe('004085616');
    expect(acn.extractDigitsCappedAtNine('004085616999')).toBe('004085616');
  });

  it('checksumMatchesAcn accepts 004085616', function () {
    expect(acn.checksumMatchesAcn('004085616')).toBe(true);
  });

  it('checksumMatchesAcn rejects bad check digit', function () {
    expect(acn.checksumMatchesAcn('004085617')).toBe(false);
  });

  it('accepts specification sample ACNs', function () {
    const samples = ['000000019', '000250000', '004249987', '005499981', '005749986'];
    samples.forEach(function (sample) {
      expect(acn.checksumMatchesAcn(sample)).toBe(true);
    });
  });

  it('formatNineDigitsWithGroupSpacing formats display', function () {
    expect(acn.formatNineDigitsWithGroupSpacing('004085616')).toBe('004 085 616');
  });

  it('groupDigitsWithSpacingForInput groups partial and full runs', function () {
    expect(acn.groupDigitsWithSpacingForInput('')).toBe('');
    expect(acn.groupDigitsWithSpacingForInput('004')).toBe('004');
    expect(acn.groupDigitsWithSpacingForInput('0040')).toBe('004 0');
    expect(acn.groupDigitsWithSpacingForInput('004085')).toBe('004 085');
    expect(acn.groupDigitsWithSpacingForInput('004085616')).toBe('004 085 616');
  });
});
