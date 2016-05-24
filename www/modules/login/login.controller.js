(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('loginController', controller);

    function controller($stateParams, $scope, $window, $state, AuthService) {

      $scope.data = {};
      $scope.err = '';

      $scope.go = go;
      $scope.login = login;
      $scope.guest = guest;

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
                    $state.go('series.premieres');
                    $scope.data = {};
                })
                .error(function (response, status) {
                    if(status == 400){
                      $scope.err = "User not found, check your Email and Password";
                      $scope.showErr = true;
                      $scope.data = {};
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

      function guest() {
        var credentials = {};
        credentials.email = "guest@email.com";
        credentials.password = "123456";
        var login = AuthService.login(credentials)
          .success(function (response) {
              $state.go('series.premieres');
          })
          .error(function (response, status) {
              if(status == 400){
                $scope.err = "User Guest actually disable :(";
                $scope.showErr = true;
              }
          });
      }
    }
})();