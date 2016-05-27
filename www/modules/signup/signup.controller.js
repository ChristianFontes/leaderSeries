(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('signupController', controller);

    function controller($stateParams, $scope, $window, $state, $sessionStorage, User,
      RequestsService, $cordovaDevice, $cordovaPush) {
      
      $scope.data = {};
      $scope.err = '';
      $scope.go = go;
      $scope.signup = signup;
      $scope.data.avatar = "./img/avatar5.png";

      function go(path){
        $state.go(path);
      }
      
      function signup(form) {
        if (!form.$invalid) {
            var user = new User($scope.data);
            user.$save(function(response) {
                $scope.data = {};
                $sessionStorage.sessionUser = response;
                $state.go('series.premieres');
            }, function(error) {
                if(error.status == 400){
                  $scope.err = "Username or Email already registered";
                  $scope.showErr = true;
                }
            });
        } else {
            angular.forEach(form.$error, function(field) {
                angular.forEach(field, function(errorField) {
                    errorField.$setTouched();
                });
            });
        }
      }
    }
})();