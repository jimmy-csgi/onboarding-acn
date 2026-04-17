angular.module('acnApp', []).controller('MainController', function () {
  // "this" is what the template sees when you write ng-controller="MainController as vm"
  this.message = 'Hello — this string lives on the controller instance.';
});
