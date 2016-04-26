(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('currentSerieController', controller);

    function controller($stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, $ionicSideMenuDelegate, User, Series, Omdb){
        $scope.go = go;
        $scope.currentSerie = {};
        $scope.summary = {};
        $scope.arrowBack = false;
        $scope.arrowNext = false;

        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.currentSerie = $sessionStorage.currentSerie;
            $scope.summary = $sessionStorage.currentSerie.show.summary.replace(/<\/?[^>]+>/gi, '');
            showPreviousEpisode();
        });

        $scope.previousepisode = function() {
            
        };

        $scope.nextepisode = function() {
            showNextEpisode();
        };

        function showNextEpisode() {
            
        };

        function showPreviousEpisode() {
            var numberCap = $sessionStorage.currentSerie.number,
                serieName = $sessionStorage.currentSerie.show.name,
                serieSeason = $sessionStorage.currentSerie.season,
                imdb = $sessionStorage.currentSerie.show.externals.imdb;

            if(imdb){
                if(numberCap == 1 && serieSeason > 1){
                    serieSeason = serieSeason -1; 
                    Omdb.showListId(imdb, serieSeason).then(function(result) {
                        var listEpisodes = result.Episodes,
                            lastElement = listEpisodes[listEpisodes.length - 1],
                            lastEpisode = lastElement.Episode;

                        Omdb.showEpisodeId(imdb, serieSeason, lastEpisode).then(function(result) {
                            if(!(result.Response == "False")){
                                $scope.previousEpisode = result;
                                $scope.arrowBack = true;
                            }
                        });
                    });
                } else {
                    numberCap = numberCap -1;
                    Omdb.showEpisodeId(imdb, serieSeason, numberCap).then(function(result) {
                        if(!(result.Response == "False")){
                            $scope.previousEpisode = result; 
                            $scope.arrowBack = true; 
                        }
                    });
                }
            } else {
                if(numberCap == 1 && serieSeason > 1){
                    serieSeason = serieSeason -1; 
                    Omdb.showListSearch(serieName, serieSeason).then(function(result) {
                        var listEpisodes = result.Episodes,
                            lastElement = listEpisodes[listEpisodes.length - 1],
                            lastEpisode = lastElement.Episode;

                        Omdb.showEpisode(serieName, serieSeason, lastEpisode).then(function(result) {
                            if(!(result.Response == "False")){
                                $scope.previousEpisode = result;
                                $scope.arrowBack = true;              
                            }
                        });
                    });
                } else {
                    numberCap = numberCap -1;
                    Omdb.showEpisode(serieName, serieSeason, numberCap).then(function(result) {   
                        if(!(result.Response == "False")){
                            $scope.previousEpisode = result;
                            $scope.arrowBack = true; 
                        }
                    });
                }
            }
        };
    }
})();