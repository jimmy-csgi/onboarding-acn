describe('acnInput directive', function () {
  let $rootScope;
  let $compile;
  let acn;
  let ACN_ERRORS;

  beforeEach(function () {
    module('acnApp');
    inject(function (_$rootScope_, _$compile_, _acn_, _ACN_ERRORS_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      acn = _acn_;
      ACN_ERRORS = _ACN_ERRORS_;
    });
  });

  function compileInput(initialDigits) {
    const scope = $rootScope.$new();
    scope.digits = initialDigits;
    const el = $compile('<input ng-model="digits" name="acnField" acn-input />')(scope);
    scope.$digest();
    return { scope: scope, el: el };
  }

  it('strips non-digits and spaces from the model', function () {
    const compiled = compileInput('');
    const input = compiled.el;
    const scope = compiled.scope;
    const ngModel = input.controller('ngModel');
    ngModel.$setViewValue('004 085 616');
    scope.$digest();
    expect(scope.digits).toBe('004085616');
  });

  it('sets checksum error for invalid ACN', function () {
    const compiled = compileInput('');
    const input = compiled.el;
    const scope = compiled.scope;
    const ngModel = input.controller('ngModel');
    ngModel.$setViewValue('004085617');
    scope.$digest();
    expect(scope.digits).toBe('004085617');
    expect(ngModel.$error[ACN_ERRORS.CHECKSUM]).toBe(true);
  });

  it('clears checksum error for valid ACN', function () {
    const compiled = compileInput('');
    const input = compiled.el;
    const scope = compiled.scope;
    const ngModel = input.controller('ngModel');
    ngModel.$setViewValue('004085616');
    scope.$digest();
    expect(acn.checksumMatchesAcn(scope.digits)).toBe(true);
    expect(ngModel.$error[ACN_ERRORS.CHECKSUM]).toBeFalsy();
  });
});
