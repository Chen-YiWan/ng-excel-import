'use strict';

/**
 * @ngdoc overview
 * @name ngExcelApp
 * @description
 * # ngExcelApp
 *
 * Main module of the application.
 */
var SheetJSImportDirective = function() {
  return {
    scope: {
      myJson: '='
    },
    link: function ($scope, $elm, $attrs) {
      $elm.on('change', function (changeEvent) {
        var file = changeEvent.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();

        reader.onload = function (e) {
          /* read workbook */
          var bstr = e.target.result;
          var workbook = XLSX.read(bstr, {type:'binary'});

          /* DO SOMETHING WITH workbook HERE */
          const sheetName = workbook.SheetNames[0];
          const firstSheet = workbook.Sheets[sheetName];

          var roa = XLSX.utils.sheet_to_json(firstSheet, { header: true });
          
          console.log('result', roa);

          $scope.myJson = JSON.stringify(roa, null, 2);
          $scope.$apply();
          console.log($scope.myJson);
        };

        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
  };
};

angular
  .module('ngExcelApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.hashPrefix('');
  })
  .directive("importSheetJs", [SheetJSImportDirective]);
