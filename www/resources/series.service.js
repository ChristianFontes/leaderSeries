(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('Series', function ($resource, apiSeries) {
            var res = $resource(apiSeries.URL + '/shows/:id', {id: '@id'});
            return res;
        });
})();