(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('mySeriesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, Omdb, mySeries){

        $scope.go = go;
        $scope.series = {};
        
        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        var series = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
            $scope.series = series;
        });
    }
})();