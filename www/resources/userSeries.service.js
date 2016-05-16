(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('userSeries', function ($resource, apiBackend) {
              
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

              function searchImdb(userID, imdb) {
                return getJSON(apiBackend.URL + "/user/"+ userID +"/series?imdb="+ imdb);
              }

              var publicAPI = {
                searchImdb: searchImdb
              };
              return publicAPI;
        });
})();