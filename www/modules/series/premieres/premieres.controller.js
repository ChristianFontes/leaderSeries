(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('premieresController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, mySeries, $ionicHistory, 
        $state, $sessionStorage, $ionicSideMenuDelegate, User, Series, userSeries,
        $ionicLoading, deviceToken){

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.go = go;
            $scope.user = {};
            $scope.series = [];
            $scope.setCurrentSerie = setCurrentSerie;
            $scope.currentSerie = {};
            $scope.selected = selected;
            $scope.data = {};
            $scope.serie = {};
            $scope.data.serie_id = {};

            if($sessionStorage.device_token != undefined){
                $scope.data.owners = $sessionStorage.sessionUser.user.id;
                $scope.data.token = $sessionStorage.device_token;
                
                var token = new deviceToken($scope.data);
                token.$save(function(response) {
                    $scope.data = {};
                }, function(error) {
                });
            }

            $ionicLoading.show();

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

            Series.schedule(null, scheduleToday)
            .then(function(result) {
                    $scope.$apply(function () {
                        $sessionStorage.schedule = result;
                        $scope.series = $sessionStorage.schedule;
                        $ionicLoading.hide();
                    });
            });

            $scope.doRefresh = function() {
                $ionicLoading.show();

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

                Series.schedule(null, scheduleToday).then(function(result) {
                    $scope.$apply(function () {
                        $sessionStorage.schedule = result;
                        $scope.series = $sessionStorage.schedule;
                        $ionicLoading.hide();
                    });
                });
                
                $scope.$broadcast('scroll.refreshComplete');
            }
        });
/*
        var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
            $scope.user = user;
        });
        */
        //var newYork = new Date().toLocaleString("en-GB", {timeZone: "America/New_York"});
        
        //console.log(newYork);

        

        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        function selected(serie){

            var userID = $sessionStorage.sessionUser.user.id,
                imdb = serie.show.externals.imdb,
                serieAdd = serie.show,
                serieID = serie.show.id;

            userSeries.searchImdb(userID, imdb).then(function(mySerie) {
                $scope.serie.serie = serieAdd;
                $scope.serie.owners = $sessionStorage.sessionUser.user.id;
                $scope.serie.serie_id = serieID;
                $scope.serie.imdb = imdb;

                if(mySerie.length > 0){
                    Materialize.toast('It is already on your list', 3000, 'rounded');
                    $scope.serie = {};
                } else {
                    var serie = new mySeries ($scope.serie);
                    serie.$save(function(response) {
                        Materialize.toast('Add on your list', 3000, 'rounded');
                        $scope.serie = {};
                    }, function(error) {
                        $scope.serie = {};
                    });
                }
            });
        }

        function setCurrentSerie(serie) {
            $sessionStorage.currentSerie = serie;
            $state.go('series.currentSerie');
        }
    }
})();