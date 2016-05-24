(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('activity', function ($resource, apiBackend) {

          var res = $resource(apiBackend.URL + '/activity/:id', {id: '@id'});
          return res;
        });
})();