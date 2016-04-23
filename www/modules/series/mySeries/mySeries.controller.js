(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('mySeriesController', controller);

    function controller($stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, $ionicSideMenuDelegate, User, Series){
        $scope.go = go;
        
        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
    
        });
    }
})();