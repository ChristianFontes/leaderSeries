(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('deviceToken', function ($resource, apiBackend) {
            var res = $resource(apiBackend.URL + '/deviceToken/:id', { id: '@id' },
                {
                    update: {
                        method: 'PUT'
                    }
                });
            return res;
        });
})();