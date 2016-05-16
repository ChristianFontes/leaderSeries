(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('mySeriesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, progressSeries, Series, mySeries, saveEpisodes,
        $ionicPopup){

        $scope.$on('$ionicView.beforeEnter', function () {

            $scope.go = go;
            $scope.user = [];
            $scope.setCurrentSerie = setCurrentSerie;
            $scope.deleteSerie = deleteSerie;
            $sessionStorage.currentSerie = null;
            
            function go(path) {
                $state.go(path);
            }

            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };

            var today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1,
            year = today.getFullYear();

            if(month < 10 && day < 10){
                var scheduleToday = year + "-0" + month + "-0" + day;
                $scope.getToday = scheduleToday;
            } else if(month > 9 && day < 10){
                var scheduleToday = year + "-" + month + "-0" + day;
                $scope.getToday = scheduleToday;
            } else if(month < 10 && day > 9){
                var scheduleToday = year + "-0" + month + "-" + day;
                $scope.getToday = scheduleToday;
            } else {
                var scheduleToday = year + "-" + month + "-" + day;
                $scope.getToday = scheduleToday;
            }

            var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
                $scope.user = user;
                $scope.listToday= [];
                $scope.nextEpisode = [];
                var limit = user.series.length,
                    limit2 = user.progressSeries.length;

                for (var i = limit - 1; i >= 0; i--) {
                    var id = user.series[i].serie_id,
                        imdb = user.series[i].imdb,
                        userID = user.id;

                    Series.episodesByDate(id,scheduleToday).then(function(episodesByDate) {
                        if(episodesByDate){
                            $scope.episode = episodesByDate;
                            $scope.listToday.push($scope.episode);
                        }
                    });

                    Series.nextEpisode(id).then(function(episodes) {
                        if(episodes){
                            $scope.nextEpisode.push(episodes);
                        }
                    });
                }
            });

            function setCurrentSerie(serie) {
                $sessionStorage.currentSerie = serie;
                $state.go('series.mySeriesEpisodes');
            }

            function deleteSerie(serie) {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Remove Serie',
                    template: 'Are you sure you want to remove this Serie?'
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        mySeries.delete({ id: serie.id }, function() {
                            $state.reload(true);
                        });
                    }
                });
            }
        });
    }
})();