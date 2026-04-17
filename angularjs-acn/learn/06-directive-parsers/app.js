angular
  .module('acnApp', [])
  .factory('acnValidator', function () {
    function normalize(input) {
      return String(input == null ? '' : input).replace(/\s/g, '');
    }

    /** What we store on ng-model: digits only, at most 9 (strips letters, spaces, etc.). */
    function parseAcnModelValue(rawInput) {
      return String(rawInput == null ? '' : rawInput)
        .replace(/\D/g, '')
        .substring(0, 9);
    }

    function isNineDigits(value) {
      return /^\d{9}$/.test(value);
    }

    function validate(nineDigits) {
      if (!isNineDigits(nineDigits)) {
        return false;
      }
      const weights = [8, 7, 6, 5, 4, 3, 2, 1];
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += Number(nineDigits[i]) * weights[i];
      }
      const remainder = sum % 10;
      // Complement to 10; if result is 10, check digit is 0.
      let expectedCheckDigit = 10 - remainder;
      if (expectedCheckDigit === 10) {
        expectedCheckDigit = 0;
      }
      return expectedCheckDigit === Number(nineDigits[8]);
    }

    return {
      normalize: normalize,
      validate: validate,
      parseAcnModelValue: parseAcnModelValue,
    };
  })
  // Directive: teach the input to keep vm.acn as "digits only, max 9"
  .directive('acnInput', function (acnValidator) {
    return {
      restrict: 'A', // use as attribute: acn-input
      require: 'ngModel', // we need ngModel's API ($parsers, etc.)
      link: function (_scope, _element, _attrs, ngModel) {
        ngModel.$parsers.push(function (viewValue) {
          return acnValidator.parseAcnModelValue(viewValue);
        });
      },
    };
  })
  .controller('MainController', function (acnValidator) {
    const vm = this;
    vm.acn = '';

    vm.check = function () {
      vm.result = acnValidator.validate(vm.acn);
    };
  });
