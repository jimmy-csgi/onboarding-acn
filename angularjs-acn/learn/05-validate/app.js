angular
  .module('acnApp', [])
  .factory('acnValidator', function () {
    function normalize(input) {
      return String(input == null ? '' : input).replace(/\s/g, '');
    }

    function isNineDigits(value) {
      return /^\d{9}$/.test(value);
    }

    // Check digit: weights 8..1 on first 8 digits, then compare to digit 9.
    // isNineDigits() guarantees each character is '0'–'9', so Number(char) is safe.
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
      // Complement remainder to 10; if that is 10, the check digit is 0 (ASIC rule).
      let expectedCheckDigit = 10 - remainder;
      if (expectedCheckDigit === 10) {
        expectedCheckDigit = 0;
      }
      return expectedCheckDigit === Number(nineDigits[8]);
    }

    return {
      normalize: normalize,
      validate: validate,
    };
  })
  .controller('MainController', function (acnValidator) {
    const vm = this;
    vm.acn = '';
    vm.result = null; // null | true | false

    vm.check = function () {
      const n = acnValidator.normalize(vm.acn);
      vm.result = acnValidator.validate(n);
    };
  });
