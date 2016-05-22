(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('loginController', controller);

    function controller($stateParams, $scope, $window, $state, AuthService) {

      $scope.data = {};
      $scope.err = '';

      $scope.go = go;
      $scope.login = login;

      function go(path){
        $state.go(path);
      }

      function login(form) {
            if (!form.$invalid) {
                var credentials = {};
                credentials.email = $scope.data.email;
                credentials.password = $scope.data.password;
                var login = AuthService.login(credentials)
                    .success(function (response) {
                        $state.go('series.Dashboard');
                    })
                    .error(function (response, status) {
                        if(status == 400){
                          $scope.err = response;
                          $scope.showErr = true;
                        }
                    });
            } else {
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    });
                });
            }
        }
    }
})();