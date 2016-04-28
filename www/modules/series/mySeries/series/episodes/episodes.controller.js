(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('episodesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, Omdb, progressSeries, Series){

        $scope.go = go;
        $scope.user = {};
        $scope.episodes = {};
        $scope.data = {};

        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
        
            var id = $sessionStorage.currentSerie;

            Series.showEpisodeList(id).then(function(result) {
                $scope.episodes = result;
                var g = _.groupBy(result, 'season');
                console.log(g);
            });

            Series.shows(id).then(function(result) {
                $scope.data = result;
            });


        });

        $(document).ready(function(){
            $('.collapsible').collapsible({
              accordion : false
            });
        });
    }
})();