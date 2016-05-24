(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('recommendController', controller);

    function controller($stateParams, $scope, $window, $state, $sessionStorage, 
        recommend, apiBackend, $http, $resource) {

    	$scope.$on('$ionicView.beforeEnter', function () {
    		$scope.recommend = [];
    		recommend.listRecommend().then(function(result) {
                $scope.$apply(function () {
                    $scope.recommend = result;

                });
            });

	        $scope.doRefresh = function() {
	        	recommend.listRecommend().then(function(result) {
                    $scope.$apply(function () {
                        $scope.recommend = result;
                    });
                });
		    	$scope.$broadcast('scroll.refreshComplete');
		    }
		});
	};
})();