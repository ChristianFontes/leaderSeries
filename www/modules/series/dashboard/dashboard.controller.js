(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('seriesDashboardController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, mySeries, $ionicHistory, 
        $state, $sessionStorage, $ionicSideMenuDelegate, User, Series, progressSeries,
        AuthService, userSeries, $ionicTabsDelegate, saveEpisodes, recommendPost, 
        $ionicLoading, seriesToday, $cordovaLocalNotification){

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

            var today = new Date(),
                day = today.getDate(),
                month = today.getMonth() + 1,
                year = today.getFullYear(),
                hour = today.getHours(),
                minute = today.getMinutes();

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

            if(hour < 10 && minute < 10){
                var time = "0" + hour + ":" + "0" + minute;
            } else if(hour > 9 && minute < 10){
                var time = hour + ":" + "0" + minute;
            } else if(hour < 10 && minute > 9){
                var time = "0" + hour + ":" +  minute;
            } else {
                var time = hour + ":" +  minute;
            }

            var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
                $scope.user = user;
                $scope.listToday = [];
                $scope.toptoday = [];
                $scope.nextEpisode = [];
                $scope.avatar = $sessionStorage.sessionUser.user.avatar;
                $scope.username = $sessionStorage.sessionUser.user.username;
                $scope.numberSeries = user.series.length;
                $sessionStorage.avatar = user.avatar;
                $scope.avatar = $sessionStorage.avatar;
                $sessionStorage.name = user.username;
                $scope.name = $sessionStorage.name;

                var isWebView = ionic.Platform.isWebView();
                var isAndroid = ionic.Platform.isAndroid();

                var mySeriesToday = user.seriesToday.length;

                $sessionStorage.userSeries = user.series;
                var limit = $sessionStorage.userSeries.length;

                if($sessionStorage.schedule.length > 0){
                    $scope.toptoday.push($sessionStorage.schedule);
                }else{
                    Series.schedule(null,scheduleToday).then(function(result) {
                        $scope.$apply(function () {
                            $sessionStorage.schedule = result;
                            $scope.toptoday.push($sessionStorage.schedule);
                        });
                    });
                } 

                for (var i = 0; i < mySeriesToday; i++) {
                    if(user.seriesToday[i].date != scheduleToday){
                        seriesToday.delete({ id: user.seriesToday[i].id }, function() {
                        });
                    } 
                }

                var interval = setInterval(function() {
                    function addZero(i) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;
                    }

                    for (var i = 0; i < mySeriesToday; i++) {
                        var now = user.seriesToday[i].mySerie.airstamp;
                        var d = new Date(now);
                        var h = addZero(d.getHours());
                        var m = addZero(d.getMinutes());
                        var compare = h + ":" + m;

                        var name = user.seriesToday[i].mySerie.name,
                            season = user.seriesToday[i].mySerie.season,
                            episode = user.seriesToday[i].mySerie.number;

                        var push = h - hour;

                        if(isAndroid && (push <= 2 && push > 0)){
                            var text = season + "x" + episode + ": " + name;
                            $cordovaLocalNotification.schedule({
                                message: text,
                                title: "Today! New episode",
                                icon: "res://icon.png"
                                }).then(function () {
                            });
                        }
                    }
                },7200000);

                for (var i = limit - 1; i >= 0; i--) {
                    var id = $sessionStorage.userSeries[i].serie.id;
                    Series.episodesByDate(id,scheduleToday).then(function(episodesByDate) {
                        if(episodesByDate){
                            $scope.listToday.push(episodesByDate);
                            $scope.data.owners = $sessionStorage.sessionUser.user.id;
                            $scope.data.mySerie = episodesByDate[0];
                            $scope.data.serieId = episodesByDate[0].id;
                            $scope.data.date = scheduleToday;
                            $scope.data.time = episodesByDate[0].airtime;
                            var user = new seriesToday($scope.data);
                            user.$save(function(response) {
                                $scope.data = {};
                            }, function(error) {
                            });
                        }
                    });

                    Series.nextEpisode(id).then(function(episodes) {
                        if(episodes){
                            $scope.nextEpisode.push(episodes);
                        }
                    });
                }
            });

            $scope.exitApp = function(){
                sessionStorage.clear();
                ionic.Platform.exitApp();
            }

            $scope.infoSerie = function(serie){
                $sessionStorage.infoSerie = serie;
                $state.go('series.infoSerie');
            }

            $scope.recommend = function(serie){
                $scope.data.avatar = $sessionStorage.avatar;
                $scope.data.username = $sessionStorage.name;
                $scope.data.serieName = serie.show.name;
                $scope.data.imageSerie = serie.show.image.medium;
                $scope.data.owners = $sessionStorage.sessionUser.user.id;
                
                var serie = new recommendPost ($scope.data);
                serie.$save(function(response) {
                    Materialize.toast('Thank you for your recommendation', 2500, 'rounded');
                    $scope.data = {};
                }, function(error) {
                    Materialize.toast('Error :(', 2500, 'rounded');
                    $scope.data = {};
                });
            }

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
                sessionStorage.clear();
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

            $scope.doRefresh = function() {
                var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
                    $scope.user = user;
                    $scope.listToday = [];
                    $scope.toptoday = [];
                    $scope.nextEpisode = [];
                    $scope.avatar = $sessionStorage.sessionUser.user.avatar;
                    $scope.username = $sessionStorage.sessionUser.user.username;
                    $scope.numberSeries = user.series.length;
                    $sessionStorage.avatar = user.avatar;
                    $scope.avatar = $sessionStorage.avatar;
                    $sessionStorage.name = user.username;
                    $scope.name = $sessionStorage.name;
                    
                    $sessionStorage.userSeries = user.series;
                    var limit = $sessionStorage.userSeries.length;

                    if($sessionStorage.schedule.length > 0){
                        $scope.toptoday.push($sessionStorage.schedule);
                    }else{
                        Series.schedule(null,scheduleToday).then(function(result) {
                            $scope.$apply(function () {
                                $sessionStorage.schedule = result;
                                $scope.toptoday.push($sessionStorage.schedule);
                            });
                        });
                    } 

                    for (var i = limit - 1; i >= 0; i--) {
                        var id = $sessionStorage.userSeries[i].serie.id;

                        Series.episodesByDate(id,scheduleToday).then(function(episodesByDate) {
                            if(episodesByDate){
                                $scope.listToday.push(episodesByDate);
                            }
                        });

                        Series.nextEpisode(id).then(function(episodes) {
                            if(episodes){
                                $scope.nextEpisode.push(episodes);
                            }
                        });
                    }
                });
                $scope.$broadcast('scroll.refreshComplete');
            }
        });
    }
})();