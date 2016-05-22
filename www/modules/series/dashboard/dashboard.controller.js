(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('seriesDashboardController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, mySeries, $ionicHistory, 
        $state, $sessionStorage, $ionicSideMenuDelegate, User, Series, progressSeries,
        AuthService, userSeries, $ionicTabsDelegate, saveEpisodes){

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.go = go;
            $scope.user = {};
            $scope.toptoday = {};
            $scope.searched = searched;
            $scope.data = {};
            $scope.confirmed = confirmed;
            $scope.addSerie = addSerie;
            $scope.serie = {};
            $scope.active = true;
            $scope.showTodayEpisode = false;
            $scope.showNextEpisode = false;
            $scope.showSearch = false;

            $rootScope.$on('$stateChangeSuccess',
              function(event, toState, toParams, fromState, fromParams) {
                $scope.icon = toState.name;
            });

            $scope.selectTabWithIndex = function(index) {
                $ionicTabsDelegate.select(index);
                if(index == 1){
                    $scope.showTodayEpisode = true;
                    $scope.showNextEpisode = false;
                    $scope.showSearch = false;
                    $scope.active = false;
                }
                if(index == 2){
                    $scope.showTodayEpisode = false;
                    $scope.showNextEpisode = true;
                    $scope.showSearch = false;
                    $scope.active = false;
                }
                if(index == 3){
                    $scope.showTodayEpisode = false;
                    $scope.showNextEpisode = false;
                    $scope.showSearch = true;
                    $scope.active = false;
                }
            }

            function go(path) {
                $state.go(path);
            }

            $scope.logout = function logout() {
                AuthService.logout();
            }

            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };

            function searched(form){
                if($scope.data.search != ""){
                    Series.showSearch($scope.data.search).then(function(search) {
                        $scope.$apply(function () {
                            $scope.data.search = "";
                            $scope.mySearch = search;
                        });
                    });
                }
            }

            function addSerie(serieID){
                Series.showByImdb(serieID).then(function(serieID) {
                    $scope.$apply(function () {
                       confirmed(serieID);
                    });
                });
            }

            function confirmed(serie){
                var userID = $sessionStorage.sessionUser.user.id,
                    imdb = serie.externals.imdb,
                    serieAdd = serie,
                    serieID = serie.id;
                
                userSeries.searchImdb(userID, imdb).then(function(mySerie) {
                    $scope.serie.serie = serieAdd;
                    $scope.serie.owners = $sessionStorage.sessionUser.user.id;
                    $scope.serie.serie_id = serieID;
                    $scope.serie.imdb = imdb;

                    if(mySerie.length > 0){
                        Materialize.toast('Already in your list', 2500, 'rounded');
                        $scope.serie = {};
                    } else {
                        var serie = new mySeries ($scope.serie);
                        serie.$save(function(response) {
                            Materialize.toast('Add a your list', 2500, 'rounded');
                            $scope.serie = {};
                            $state.reload(true);
                        }, function(error) {
                            Materialize.toast('Already in your list', 2500, 'rounded');
                            $scope.serie = {};
                        });
                    }
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
                $scope.user = user;
                $scope.listToday = [];
                $scope.listImage = [];
                $scope.toptoday = [];
                $scope.nextEpisode = [];
                $scope.numberSeries = user.series.length;
                $scope.avatar = $sessionStorage.sessionUser.user.avatar;
                $scope.username = $sessionStorage.sessionUser.user.username;

                var limit = user.series.length;

                for (var i = limit - 1; i >= 0; i--) {
                    var id = user.series[i].serie.id;

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

                Series.schedule(null,scheduleToday).then(function(result) {
                    $scope.$apply(function () {
                        $scope.toptoday.push(result);
                    });
                });  
            });
        });
    }
})();