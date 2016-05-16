(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('signupController', controller);

    function controller($stateParams, $scope, $window, $state, $sessionStorage, User) {
      
      $scope.data = {};
      $scope.err = '';
      $scope.go = go;
      $scope.signup = signup;
      $scope.data.avatar = "/img/avatar-default.jpg";

      function go(path){
        $state.go(path);
      }

      function signup(form) {
            if (!form.$invalid) {
                var user = new User($scope.data);
                user.$save(function(response) {
                    $sessionStorage.sessionUser = response;
                    if($sessionStorage.currentProject)
                        delete $sessionStorage.currentProject;
                    $state.go('series.Dashboard');
                }, function(error) {
                    $scope.err = error;
                    $scope.showErr = true;
                    setTimeout(function (){
                        $scope.$apply(function(){
                        $scope.showErr = false;
                        });
                    }, 3000);
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