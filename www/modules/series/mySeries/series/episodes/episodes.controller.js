(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('episodesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, Series, progressSeries, saveEpisodes){
        $scope.$on('$ionicView.beforeEnter', function () {

            $scope.go = go;
            $scope.user = {};
            $scope.episodes = {};
            $scope.data = {};
            $scope.episode = {};
            $scope.listEpisodes = [];
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
        
            var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
                if(user.progressSeries.length == 0){
                    $scope.progressSeries = {
                        episodeId: "0"
                    };
                } else {
                    $scope.progressSeries = user.progressSeries;
                }
            });

            $scope.seasons = [];

            $scope.data = $sessionStorage.currentSerie;
            var id = $sessionStorage.currentSerie.serie_id,
                imdb = $sessionStorage.currentSerie.imdb;

            Series.showByImdb(imdb).then(function(data) {
                $scope.$apply(function () {
                    if(data){
                        $scope.data = data;
                    } else {
                        console.log("No imdb");
                    }
                });
            });
            
            Series.showSeasonList(id).then(function(result) {
                $scope.$apply(function () {
                    $scope.listSeasons = result;
                });
            });

            Series.showEpisodeList(id).then(function(result) {
                $scope.$apply(function () {
                    $scope.listEpisodes = result;
                });
            });

            $scope.toggleEye = function(episode) {

                var userID = $sessionStorage.sessionUser.user.id,
                    episodeId = episode.id,
                    mySerie = $scope.data,
                    imdb = $sessionStorage.currentSerie.imdb,
                    episodeAdd = episode;
                
                progressSeries.checkEpisode(userID, imdb, episodeId).then(function(myEpisode) {

                    $scope.episode.owners = userID;
                    $scope.episode.mySerie = mySerie;
                    $scope.episode.episodeId = episodeId;
                    $scope.episode.serieIMDB = imdb;
                    $scope.episode.info = episodeAdd;

                    if(myEpisode.length > 0){
                        var deleteID = myEpisode[0].id;
                        saveEpisodes.delete({ id: deleteID }, function() {
                            Materialize.toast('Remove Episode from your list', 2500, 'rounded');
                            $scope.serie = {};
                        });
                    }else {
                        var episode = new saveEpisodes($scope.episode);
                        episode.$save(function(response) {
                            Materialize.toast('Add a your list', 2500, 'rounded');
                        }, function(error) {
                            Materialize.toast('Failed add to your list', 2500, 'rounded');
                        });
                    }
                });
            };

            $(document).ready(function(){
                $('.collapsible').collapsible({
                  accordion : false
                });
            });
        });
    }
})();