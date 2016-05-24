(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('episodesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, Series, progressSeries, saveEpisodes, $ionicLoading){

        $scope.$on('$ionicView.beforeEnter', function () {
            $ionicLoading.show();
            $scope.go = go;
            $scope.user = {};
            $scope.episodes = {};
            $scope.data = {};
            $scope.episode = {};
            $scope.listEpisodes = [];
            $scope.list = [];
            $scope.listEpisodesShow = [];
            $scope.myEpisodes = {};
            $scope.progressSeries = [];

            function go(path) {
                $state.go(path);
            }

            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.toggleGroup = function(group) {
                group.show = !group.show;
            };

            $scope.isGroupShown = function(group) {
                return group.show;
            };

            $scope.seasons = [];

            $scope.data = $sessionStorage.currentSerie;
            var id = $sessionStorage.currentSerie.serie.id,
                imdb = $sessionStorage.currentSerie.imdb;

            Series.showByImdb(imdb).then(function(data) {
                $scope.$apply(function () {
                    if(data){
                        $scope.data = data;
                        $ionicLoading.hide();
                    } else {
                        console.log("No imdb");
                    }
                });
            });
            
            Series.showSeasonList(id).then(function(result) {
                $scope.$apply(function () {
                    $scope.listSeasons = result;
                    $ionicLoading.hide();
                });
            });

            Series.showEpisodeList(id).then(function(result) {
                $scope.$apply(function () {
                    $scope.list = result;
                    var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
                        $scope.progressSeries = user.progressSeries;

                        if(user.progressSeries.length == 0){
                            user.progressSeries.length = 1;
                        }

                        for (var j = 0; j <= $scope.list.length-1; j++) {
                            for (var i = 0; i <= user.progressSeries.length-1; i++) {
                                if($scope.list[j].id == $scope.progressSeries[i].episodeId){
                                    $scope.list[j].viewed = true;
                                    $scope.listEpisodes.push($scope.list[j]);
                                    break;
                                }
                                if($scope.list[j].id != $scope.progressSeries[i].episodeId){
                                    
                                    $scope.listEpisodes.push($scope.list[j]);
                                }
                            }
                        }

                        $scope.list = [];
                        $.each($scope.listEpisodes, function(i, el){
                            if($.inArray(el, $scope.list) === -1) $scope.list.push(el);
                        });
                        $ionicLoading.hide();
                    });
                });
            });

            $scope.toggleEye = function(episode) {
                $ionicLoading.show();
                var userID = $sessionStorage.sessionUser.user.id,
                    episodeId = episode.id,
                    mySerie = $scope.data,
                    imdb = $sessionStorage.currentSerie.imdb,
                    episodeAdd = episode;
                    delete episode._links;
                
                progressSeries.checkEpisode(userID, imdb, episodeId).then(function(myEpisode) {

                    $scope.episode.owners = userID;
                    $scope.episode.mySerie = mySerie;
                    $scope.episode.episodeId = episodeId;
                    $scope.episode.serieIMDB = imdb;
                    $scope.episode.info = episodeAdd;

                    if(myEpisode.length > 0){
                        var deleteID = myEpisode[0].id;
                        saveEpisodes.delete({ id: deleteID }, function() {
                            $scope.serie = {};
                            $ionicLoading.hide();
                        });
                    }else {
                        var episode = new saveEpisodes($scope.episode);
                        episode.$save(function(response) {
                            $scope.serie = {};
                            $ionicLoading.hide();
                        }, function(error) {
                            $scope.serie = {};
                            $ionicLoading.hide();
                        });
                    }
                });
            };
        });
    }
})();