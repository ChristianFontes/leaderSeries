(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('User', function ($resource, apiBackend) {
            var res = $resource(apiBackend.URL + '/user/:id', { id: '@id' },
                {
                    update: {
                        method: 'PUT'
                    }
                });
            return res;
        });
})();