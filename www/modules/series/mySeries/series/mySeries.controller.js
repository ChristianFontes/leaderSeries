(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('mySeriesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, Omdb, progressSeries, Series){

        $scope.go = go;
        $scope.user = {};
        $scope.setCurrentSerie = setCurrentSerie;
        
        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
            $scope.user = user;
            /*
            for (var series in $scope.user.series) {
                
                if($scope.user.series[series].imdb){
                    var id = $scope.user.series[series].imdb,
                        season = $scope.user.series[series].serie.season,
                        episode = $scope.user.series[series].serie.number;
                        console.log(id);
                       
                    Omdb.showListId(id, 1).then(function(result) {
                        $scope.omdb = result;
                        console.log(result);
                    });
                }
                
            }*/
            /*
            Omdb.showEpisodeId(431, "1994-09-22").then(function(result) {
              console.log(result);
            });*/
        });

        function setCurrentSerie(serie) {
            $sessionStorage.currentSerie = serie.serie.show.id;
            $state.go('series.mySeriesEpisodes', { id: serie.serie.show.id });
        }
    }
})();