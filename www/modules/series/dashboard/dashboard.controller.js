(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('seriesDashboardController', controller);

    function controller(
        $stateParams, $rootScope, $filter, $http, $scope, $window, mySeries, $ionicHistory, 
        $state, $sessionStorage, $ionicSideMenuDelegate, User, Series, progressSeries){
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

        if($sessionStorage.oneTime == 0){
            Series.schedule(null, scheduleToday).then(function(result) {
                $sessionStorage.schedule = result;
                $scope.series = $sessionStorage.schedule;
            });
            $sessionStorage.oneTime = 1;
        }

        var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
            $scope.user = user;
        });
        
        //var newYork = new Date().toLocaleString("en-GB", {timeZone: "America/New_York"});
        
        //console.log(newYork);

        var today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1,
            year = today.getFullYear();

        if(month < 10){
            var scheduleToday = year+"-0"+month+"-"+day;
            $scope.today = scheduleToday;
        } else {
            var scheduleToday = year+"-"+month+"-"+day;
            $scope.today = scheduleToday;
        }

        function go(path) {
            $state.go(path);
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        function selected(serie){

            $scope.data.serie = serie;
            $scope.data.owners = $sessionStorage.sessionUser.user.id;
            $scope.data.serie_id = serie.id;
            $scope.serie.owners = $sessionStorage.sessionUser.user.id;
            $scope.serie.serie_id = serie.id;
            $scope.serie.seasons = 1;
            $scope.serie.episodes = 1;

            if(serie.show.externals.imdb != null){
                $scope.data.imdb = serie.show.externals.imdb;
                $scope.serie.imdb = serie.show.externals.imdb;
            }
            var serie = new mySeries ($scope.data);

            serie.$save(function(response) {
                Materialize.toast('Add a your list', 2500, 'rounded');
                console.log($scope.data);
                $scope.data = {};
            }, function(error) {
                Materialize.toast('Already in your list', 2500, 'rounded');
                console.log(error);
                $scope.data = {};
            });

            var progress = new progressSeries ($scope.serie);

            progress.$save(function(response) {
                console.log($scope.serie);
                $scope.serie = {};
            }, function(error) {
                console.log(error);
                $scope.serie = {};
            });
        }

        function setCurrentSerie(serie) {
            $sessionStorage.currentSerie = serie;
            $state.go('series.currentSerie');
        }
    }
})();