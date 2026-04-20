const NAVIGATION_KEYS = [
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

angular
  .module('acnApp', [])
  .constant(
    'ACN_ERRORS',
    Object.freeze({
      CHECKSUM: 'acnChecksum',
      COMPLETE: 'acnComplete',
    }),
  )
  .factory('acn', function createAcn() {
    function stripGroupingSpaces(raw) {
      return String(raw == null ? '' : raw).replace(/\s/g, '');
    }

    function extractDigitsCappedAtNine(rawInput) {
      return String(rawInput == null ? '' : rawInput)
        .replace(/\D/g, '')
        .substring(0, 9);
    }

    function hasExactlyNineDigits(value) {
      return /^\d{9}$/.test(value);
    }

    function checksumMatchesAcn(nineDigits) {
      if (!hasExactlyNineDigits(nineDigits)) {
        return false;
      }
      const weights = [8, 7, 6, 5, 4, 3, 2, 1];
      let weightedSum = 0;
      for (let weightIndex = 0; weightIndex < 8; weightIndex++) {
        weightedSum += Number(nineDigits[weightIndex]) * weights[weightIndex];
      }
      const remainder = weightedSum % 10;
      let expectedCheckDigit = 10 - remainder;
      if (expectedCheckDigit === 10) {
        expectedCheckDigit = 0;
      }
      return expectedCheckDigit === Number(nineDigits[8]);
    }

    /** Inserts ASIC-style spaces for 1–9 stored digits (ngModel `$formatters` / filter). */
    function groupDigitsWithSpacingForInput(storedDigits) {
      if (!storedDigits) {
        return '';
      }
      const digitRun = String(storedDigits);
      const digitCount = digitRun.length;
      if (digitCount <= 3) {
        return digitRun;
      }
      if (digitCount <= 6) {
        return digitRun.slice(0, 3) + ' ' + digitRun.slice(3);
      }
      return digitRun.slice(0, 3) + ' ' + digitRun.slice(3, 6) + ' ' + digitRun.slice(6, 9);
    }

    function formatNineDigitsWithGroupSpacing(nineDigits) {
      if (!hasExactlyNineDigits(nineDigits)) {
        return nineDigits;
      }
      return groupDigitsWithSpacingForInput(nineDigits);
    }

    return {
      stripGroupingSpaces: stripGroupingSpaces,
      extractDigitsCappedAtNine: extractDigitsCappedAtNine,
      checksumMatchesAcn: checksumMatchesAcn,
      formatNineDigitsWithGroupSpacing: formatNineDigitsWithGroupSpacing,
      groupDigitsWithSpacingForInput: groupDigitsWithSpacingForInput,
      hasExactlyNineDigits: hasExactlyNineDigits,
    };
  })
  .directive('acnInput', function createAcnInputDirective(acn, $timeout, ACN_ERRORS) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function linkAcnInput(scope, element, _attrs, ngModel) {
        const inputElement = element[0];

        function refreshViewAfterModelChanged() {
          $timeout(function runProcessModelValue() {
            ngModel.$processModelValue();
          });
        }

        function updateChecksumValidity(digits) {
          if (digits.length === 9) {
            ngModel.$setValidity(ACN_ERRORS.CHECKSUM, acn.checksumMatchesAcn(digits));
          } else {
            ngModel.$setValidity(ACN_ERRORS.CHECKSUM, true);
          }
        }

        function updateCompleteValidity(digits) {
          const isEmptyOrFull = digits.length === 0 || digits.length === 9;
          ngModel.$setValidity(ACN_ERRORS.COMPLETE, isEmptyOrFull);
        }

        function parseInput(viewValue) {
          const digits = acn.extractDigitsCappedAtNine(viewValue);
          updateChecksumValidity(digits);
          updateCompleteValidity(digits);
          refreshViewAfterModelChanged();
          return digits;
        }

        function formatDisplay(modelValue) {
          return acn.groupDigitsWithSpacingForInput(modelValue);
        }

        function countSelectedCharacters() {
          if (inputElement.selectionStart == null || inputElement.selectionEnd == null) {
            return 0;
          }
          return inputElement.selectionEnd - inputElement.selectionStart;
        }

        function countDigitsInModel() {
          return (ngModel.$modelValue || '').length;
        }

        function onKeydown(event) {
          if (event.metaKey || event.ctrlKey || event.altKey) {
            return;
          }
          const key = event.key;
          if (NAVIGATION_KEYS.includes(key)) {
            return;
          }
          if (key.length === 1) {
            if (!/\d/.test(key)) {
              event.preventDefault();
              return;
            }
            if (countDigitsInModel() >= 9 && countSelectedCharacters() === 0) {
              event.preventDefault();
            }
          }
        }

        function onPaste(event) {
          event.preventDefault();
          const clipboard = (event.originalEvent || event).clipboardData.getData('text/plain');
          const currentDigits = ngModel.$modelValue || '';
          const mergedDigits = acn.extractDigitsCappedAtNine(currentDigits + clipboard);
          scope.$applyAsync(function setPastedDigits() {
            ngModel.$setViewValue(mergedDigits);
          });
        }

        ngModel.$parsers.push(parseInput);
        ngModel.$formatters.push(formatDisplay);

        element.on('keydown', onKeydown);
        element.on('paste', onPaste);

        scope.$on('$destroy', function detachDomListeners() {
          element.off('keydown paste');
        });
      },
    };
  })
  .filter('formatAcn', function createFormatAcnFilter(acn) {
    return function formatDigitsForTemplate(digits) {
      return acn.formatNineDigitsWithGroupSpacing(digits);
    };
  })
  .controller('MainController', function createMainController(ACN_ERRORS) {
    const vm = this;
    vm.digits = '';
    vm.errors = ACN_ERRORS;
  });
