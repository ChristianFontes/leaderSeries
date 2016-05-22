(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('premieresController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, mySeries, $ionicHistory, 
        $state, $sessionStorage, $ionicSideMenuDelegate, User, Series, userSeries){
        $scope.go = go;
        $scope.user = {};
        $scope.series = [];
        $scope.setCurrentSerie = setCurrentSerie;
        $scope.currentSerie = {};
        $scope.selected = selected;
        $sessionStorage.oneTime = 0;
        $scope.data = {};
        $scope.serie = {};
        $scope.data.serie_id = {};

        $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams, fromState, fromParams) {
            $scope.icon = toState.name;
        });

        $scope.$on('$ionicView.beforeEnter', function () {

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


            if($sessionStorage.oneTime == 0){
                Series.schedule(null, scheduleToday).then(function(result) {
                    $scope.$apply(function () {
                        $sessionStorage.schedule = result;
                        $scope.series = $sessionStorage.schedule;
                    });
                });
                $sessionStorage.oneTime = 1;
            }
        });

        var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
            $scope.user = user;
        });
        
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
                    var deleteID = mySerie[0].id;
                    mySeries.delete({ id: deleteID }, function() {
                        $scope.serie = {};
                    });
                    $scope.serie = {};
                } else {
                    var serie = new mySeries ($scope.serie);
                    serie.$save(function(response) {
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