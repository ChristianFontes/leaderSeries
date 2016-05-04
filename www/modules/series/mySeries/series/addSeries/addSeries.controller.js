(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('addSeriesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, Omdb, progressSeries, Series){

        $scope.search = search;
        $scope.data = {};
        $scope.mySearch = {};

        function search(form){
            Omdb.showSearch($scope.data.search).then(function(result) {
                $scope.$apply(function () {
                    $scope.mySearch = result;
                    console.log(result);
                });
                
            });
        }
    }
})();