(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('infoSerieController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, mySeries, $ionicHistory, 
        $state, $sessionStorage, $ionicSideMenuDelegate){

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.go = go;
            $scope.infoSerie = $sessionStorage.infoSerie;

            function go(path) {
                $state.go(path);
            }
        });
    }
})();