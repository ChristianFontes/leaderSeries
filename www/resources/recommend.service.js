(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('recommend', function ($resource, apiBackend) {

          function getJSON(url) {
            return new Promise(function(resolve, reject){
              var req = new XMLHttpRequest();
              req.open('GET', url);
              req.responseType = 'json';
              req.onload = function() {
                if (req.status == 200) {
                  resolve(req.response);
                }
                else {
                  reject(Error(req.statusText));
                }
              };
              req.onerror = function() {
                reject(Error("Network Error"));
              };
              req.send();
            });
          }

          function listRecommend() {
            return getJSON(apiBackend.URL + "/recommend");
          }

          var publicAPI = {
            listRecommend: listRecommend
          };
          
          return publicAPI;
      })

      .factory('recommendPost', function ($resource, apiBackend) {
        var res = $resource(apiBackend.URL + '/recommend/:id', {id: '@id'});
        return res;
      });
})();