(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('mySeries', function ($resource, apiBackend) {
            var res = $resource(apiBackend.URL + '/series/:id', {id: '@id'});
            return res;
        });
})();