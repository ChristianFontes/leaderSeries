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
        $scope.episode = {};
        $scope.listEpisodes = [];
        $scope.listEpisodesShow = [];
        $scope.myEpisodes = {};

        function go(path) {
            $state.go(path);
        }

        function ArrNoDupe(a) {
            var temp = {};
            for (var i = 0; i < a.length; i++)
                temp[a[i]] = true;
            var r = [];
            for (var k in temp)
                r.push(k);
            return r;
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

        $scope.$on('$ionicView.beforeEnter', function () {
        
            var id = $sessionStorage.currentSerie;

            Series.showSeasonList(id).then(function(result) {
                $scope.seasons = result;
            });

            Series.showEpisodeList(id).then(function(result) {
                $scope.episodes = result;

                /*
                var progress = progressSeries.query(function () {

                    $scope.progress = progress;


                    for (var j = 0; j <= progress.length - 1; j++) {
                        $scope.listEpisodesShow.push($scope.progress[j].episodeId);
                        console.log($scope.listEpisodesShow);
                    }

                    if(progress.length > 0){
                        
                        for (var i = 0; i <= result.length - 1; i++) {
                            for (var j = 0; j <= progress.length - 1; j++) {
                                if(result[i].id == $scope.listEpisodesShow[j]){
                                    $scope.progress.show = true;
                                    $scope.listEpisodes.push($scope.progress[j].episodes);
                                    console.log($scope.listEpisodes);
                                    i++;
                                }else{
                                    $scope.listEpisodes.push(result[i]);
                                    console.log($scope.listEpisodes);
                                    i++;
                                }
                            }
                        }
                    } else {
                        $scope.listEpisodes = $scope.episodes;
                    }                
                });*/
            });

            Series.shows(id).then(function(result) {
                $scope.data = result;
            });
            
            $(document).ready(function(){
                $('.collapsible').collapsible({
                  accordion : false
                });
            });

            $scope.toggleEye = function(episode) {
                episode.show = !episode.show;
                var episodeId = episode.id;

                if(episode.show){
                    //add episode
                    $scope.episode.owners = $sessionStorage.sessionUser.user.id;
                    $scope.episode.serie = $scope.data;
                    $scope.episode.episodes = episode;
                    $scope.episode.episodeId = episode.id;

                    var episode = new progressSeries ($scope.episode);

                    episode.$save(function(response) {
                        Materialize.toast('Add a your list', 2500, 'rounded');
                    }, function(error) {
                        Materialize.toast('Already in your list', 2500, 'rounded');
                    });
                } else {
                    Materialize.toast('Deleted in your list', 2500, 'rounded');
                    var progress = progressSeries.query(function () {
                        $scope.progress = progress;
                        for (var i = progress.length - 1; i >= 0; i--) {
                            if(episodeId == progress[i].episodes.id){
                                var episode = new progressSeries ({id: progress[i].id});
                                episode.$delete(function(response) {
                                    console.log(response);
                                }, function(error) {
                                    console.log(error);
                                });
                            }
                        }
                    });
                }
            };

            $scope.view = function(episode) {
               return episode.show;
                
            };
        });
    }
})();