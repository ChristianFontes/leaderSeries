(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('currentSerieController', controller);

    function controller($stateParams, $rootScope, $filter, $http, $scope, $window, $state, 
        $sessionStorage, $ionicSideMenuDelegate, User, Series){
        $scope.go = go;
        $scope.currentSerie = {};
        $scope.summary = {};
        $scope.listSeasons = [];
        $scope.listEpisodes = [];
        $scope.casting = casting;

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

        function go(path) {
            $state.go(path);
        }

        function casting(currentSerie){
            $sessionStorage.casting = currentSerie;
            $state.go('series.casting');
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.currentSerie = $sessionStorage.currentSerie;
            $scope.summary = $sessionStorage.currentSerie.show.summary.replace(/<\/?[^>]+>/gi, '');
            var id = $scope.currentSerie.show.id;
            var seasonID = $scope.currentSerie.season;
        
            Series.showSeasonList(id).then(function(listSeasons) {
                if(listSeasons){
                    $scope.$apply(function () {
                        $scope.lastSeason = seasonID;
                        $scope.listSeasons = listSeasons;
                    });

                    Series.showEpisodeList(id).then(function(listEpisodes) {
                        $scope.$apply(function () {
                            $scope.listEpisodes = listEpisodes;
                        });
                    });  
                }
            });
        });
    }
})();