(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('mySeriesController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, 
        $ionicSideMenuDelegate, User, progressSeries, Series, mySeries, saveEpisodes,
        $ionicPopup, recommendPost, $ionicLoading){

        $scope.$on('$ionicView.beforeEnter', function () {

            $scope.go = go;
            $scope.user = [];
            $scope.setCurrentSerie = setCurrentSerie;
            $scope.deleteSerie = deleteSerie;
            $sessionStorage.currentSerie = null;
            $scope.shouldShowDelete = false;
            
            function go(path) {
                $state.go(path);
            }

            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.recommend = function(serie){
                $ionicLoading.show();
                $scope.data.avatar = $sessionStorage.avatar;
                $scope.data.username = $sessionStorage.name;
                $scope.data.serieName = serie.name;
                $scope.data.imageSerie = serie.image.medium;
                
                var serie = new recommendPost ($scope.data);
                serie.$save() 
                    .then(function(res)  { 
                        Materialize.toast('Thank you for your recommendation', 2500, 'rounded');
                        $ionicLoading.hide();
                    })
                    .catch(function(req) { 
                        Materialize.toast('Thank you for your recommendation', 2500, 'rounded');
                        $ionicLoading.hide(); 
                    })
                    .finally(function()  { 
                        $ionicLoading.hide(); 
                    });
            }


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
                $ionicLoading.show();
                $scope.user = user;
                $scope.listToday= [];
                $scope.nextEpisode = [];
                var limit = user.series.length,
                    limit2 = user.progressSeries.length;

                for (var i = limit - 1; i >= 0; i--) {
                    var id = user.series[i].serie.id,
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
                $ionicLoading.hide();
            });

            $scope.doRefresh = function() {
                $ionicLoading.show();
                var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
                    $scope.user = user;
                    $scope.listToday= [];
                    $scope.nextEpisode = [];
                    var limit = user.series.length,
                        limit2 = user.progressSeries.length;

                    for (var i = limit - 1; i >= 0; i--) {
                        var id = user.series[i].serie.id,
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
                    $ionicLoading.hide();
                });
                $scope.$broadcast('scroll.refreshComplete');
            }

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