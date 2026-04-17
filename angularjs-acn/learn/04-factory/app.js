angular
  .module('acnApp', [])
  .factory('acnValidator', function () {
    // A factory returns one object. Think: "module with functions" (like a util file).
    return {
      normalize: function (input) {
        return String(input == null ? '' : input).replace(/\s/g, '');
      },
    };
  })
  .controller('MainController', function (acnValidator) {
    const vm = this;
    vm.acn = '';
    // We expose a tiny helper so the template can show "digits only, no spaces"
    vm.normalized = function () {
      return acnValidator.normalize(vm.acn);
    };
  });
