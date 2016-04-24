(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('seriesDashboardController', controller);

    function controller($stateParams, $rootScope, $filter, $http, $scope, $window, $state, $sessionStorage, $ionicSideMenuDelegate, User, Series){
        $scope.go = go;
        $scope.user = {};
        $scope.series = [];
        $scope.setCurrentSerie = setCurrentSerie;
        $scope.currentSerie = {};
        $scope.selected = selected;
        var seriesDaily = [];

        var newYork = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
        
        console.log(newYork);

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

        $scope.$on('$ionicView.beforeEnter', function () {
            var user = User.get({
                id: $sessionStorage.sessionUser.user.id
            }, function () {
                $scope.user = user;
            });
            
            Series.schedule(null, scheduleToday).then(function(result) {
                $scope.series = result;
                seriesDaily.push(result);
            });
        });

        function selected(serie){
            Materialize.toast('Add a your list', 2500, 'rounded');
            console.log(serie);
        }

        function setCurrentSerie(serie) {
            $sessionStorage.currentSerie = serie;
            $state.go('series.currentSerie');
        }
    }
})();