(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('progressSeries', function ($resource, apiBackend) {

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
            
            function checkEpisode(userID, imdb, episodeId) {
              return getJSON(apiBackend.URL + "/user/"+ userID +
                "/progressSeries?episodeId="+ episodeId + "&serieIMDB=" + imdb);
            }

            function listEpisodes(userID, imdb) {
              return getJSON(apiBackend.URL + "/user/"+ userID +
                "/progressSeries?serieIMDB=" + imdb);
            }

            var publicAPI = {
                checkEpisode: checkEpisode,
                listEpisodes: listEpisodes
            };

            return publicAPI;
        })

        .factory('saveEpisodes', function ($resource, apiBackend) {

          var res = $resource(apiBackend.URL + '/progressseries/:id', {id: '@id'});
          return res;
        });
})();