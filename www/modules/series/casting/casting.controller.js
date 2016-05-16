(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('castingController', controller);

    function controller($stateParams, $rootScope, $filter, $http, $scope, $window, $state, 
        $sessionStorage, $ionicSideMenuDelegate, User, Series){

    	$scope.$on('$ionicView.beforeEnter', function () {
	        $scope.go = go;
	        $scope.casting = [];
	        $scope.error = false;
	        var id = $sessionStorage.casting.show.id;

	        function go(path) {
	            $state.go(path);
	        }
	        
	        Series.showCast(id).then(function(casting) {
                if(casting.length > 0){
                    $scope.$apply(function () {
                    	$scope.casting = casting;
                    });
                } else {
                    $scope.error = true;
                }
            });
    	});
    }
})();