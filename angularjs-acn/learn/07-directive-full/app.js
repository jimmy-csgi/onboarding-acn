angular
  .module('acnApp', [])
  .factory('acnValidator', function () {
    function normalize(input) {
      return String(input == null ? '' : input).replace(/\s/g, '');
    }

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

    function formatDisplay(nineDigits) {
      if (!isNineDigits(nineDigits)) {
        return nineDigits;
      }
      return (
        nineDigits.slice(0, 3) + ' ' + nineDigits.slice(3, 6) + ' ' + nineDigits.slice(6, 9)
      );
    }

    return {
      normalize: normalize,
      parseAcnModelValue: parseAcnModelValue,
      validate: validate,
      formatDisplay: formatDisplay,
    };
  })
  .directive('acnInput', function (acnValidator, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, _attrs, ngModel) {
        const inputEl = element[0];

        ngModel.$parsers.push(function (viewValue) {
          const digits = acnValidator.parseAcnModelValue(viewValue);

          if (digits.length === 9) {
            ngModel.$setValidity('acnChecksum', acnValidator.validate(digits));
          } else {
            ngModel.$setValidity('acnChecksum', true);
          }
          ngModel.$setValidity('acnComplete', digits.length === 0 || digits.length === 9);

          // $formatters are skipped for view updates from typing; refresh display (spaces).
          $timeout(function () {
            ngModel.$processModelValue();
          });

          return digits;
        });

        // $formatters: model → view (what appears in the input)
        ngModel.$formatters.push(function (modelValue) {
          if (!modelValue) {
            return '';
          }
          const v = String(modelValue);
          if (v.length <= 3) {
            return v;
          }
          if (v.length <= 6) {
            return v.slice(0, 3) + ' ' + v.slice(3);
          }
          return v.slice(0, 3) + ' ' + v.slice(3, 6) + ' ' + v.slice(6, 9);
        });

        function selectionLength() {
          if (inputEl.selectionStart == null || inputEl.selectionEnd == null) {
            return 0;
          }
          return inputEl.selectionEnd - inputEl.selectionStart;
        }

        function modelDigitCount() {
          return (ngModel.$modelValue || '').length;
        }

        element.on('keydown', function (event) {
          if (event.metaKey || event.ctrlKey || event.altKey) {
            return;
          }
          const key = event.key;
          const navigation = [
            'Backspace',
            'Delete',
            'Tab',
            'Escape',
            'Enter',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Home',
            'End',
          ];
          if (navigation.indexOf(key) !== -1) {
            return;
          }
          if (key.length === 1) {
            if (!/\d/.test(key)) {
              event.preventDefault();
              return;
            }
            if (modelDigitCount() >= 9 && selectionLength() === 0) {
              event.preventDefault();
            }
          }
        });

        element.on('paste', function (event) {
          event.preventDefault();
          const clip = (event.originalEvent || event).clipboardData.getData('text/plain');
          const cur = ngModel.$modelValue || '';
          const next = acnValidator.parseAcnModelValue(cur + clip);
          scope.$applyAsync(function () {
            ngModel.$setViewValue(next);
            ngModel.$render();
          });
        });

        scope.$on('$destroy', function () {
          element.off('keydown paste');
        });
      },
    };
  })
  .filter('acnDisplay', function (acnValidator) {
    return function (digits) {
      return acnValidator.formatDisplay(digits);
    };
  })
  .controller('MainController', function () {
    this.acn = '';
  });
