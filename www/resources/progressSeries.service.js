(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('progressSeries', function ($resource, apiBackend) {
            var res = $resource(apiBackend.URL + '/progressseries/:id', { id: '@id' },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
            return res;
        });
})();