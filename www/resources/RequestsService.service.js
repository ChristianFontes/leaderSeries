(function(){
    'use strict';

    angular.module('leaderSeries')
    
    .service('RequestsService', ['$http', '$q', '$ionicLoading',  RequestsService]);

    function RequestsService($http, $q, $ionicLoading, $sessionStorage){

        var base_url = 'http://107.180.66.6:3000';

        function register(device_token){
            var deferred = $q.defer();
            
            $http.post(base_url + '/register', {
                'device_token': device_token

                }).success(function(response){
                    deferred.resolve(response);
                })
                .error(function(data){
                    deferred.reject();
                });
            return deferred.promise;
        };

        return {
            register: register
        };
    }
})();
