(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('currentSerieController', controller);

    function controller($stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, $ionicSideMenuDelegate, User, Series){
        $scope.go = go;
        $scope.currentSerie = {};
        $scope.summary = {};

        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.currentSerie = $sessionStorage.currentSerie;
            $scope.summary = $sessionStorage.currentSerie.show.summary.replace(/<\/?[^>]+>/gi, '');
            episodes();
        });

        $scope.previousepisode = function() {
            $scope.previous = $sessionStorage.currentSerie.show._links.previousepisode.href;
            var previous = $scope.previous.replace(/[^0-9]/g, '');
        };

        $scope.nextepisode = function() {
            $scope.next = $sessionStorage.currentSerie.show._links.nextepisode.href;
            var next = $scope.next.replace(/[^0-9]/g, '');
        };

        function episodes() {
            var episodeId = $sessionStorage.currentSerie.show.id;
            Series.showEpisodeList(episodeId).then(function(result) {
                $scope.episodes = result;
            });
        };

    }
})();