(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('seriesToday', function ($resource, apiBackend) {
            var res = $resource(apiBackend.URL + '/seriesToday/:id', { id: '@id' },
                {
                    update: {
                        method: 'PUT'
                    }
                });
            return res;
        });
})();