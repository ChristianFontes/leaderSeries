(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('seriesDashboardController', controller);

    function controller($stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, $ionicSideMenuDelegate, User, Series){
        $scope.go = go;
        $scope.user = {};
        $scope.series = {};


        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            var user = User.get({
                id: $sessionStorage.sessionUser.user.id
            }, function () {
                $scope.user = user;

            });
/*
            var series = Series.get({id: '1'}, function () {
                $scope.series = series;
                console.log($scope.series);

            });

            $http({
              method: 'GET',
              url: 'http://api.tvmaze.com/search/shows?q=girls'
            }).then(function successCallback(response) {
                $scope.series = series;
                console.log("HTTP ",$scope.series);
                // this callback will be called asynchronously
                // when the response is available
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });*/
        });
    }
})();