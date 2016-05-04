(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('Omdb', function ($resource, omdbApi) {
              
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

              function showSearch(query) {
                return getJSON(omdbApi.URL + "/?s=" + encodeURIComponent(query));
              }

              function showEpisode(query, season, episode) {
                return getJSON(omdbApi.URL + "/?t=" + encodeURIComponent(query) + 
                "&season=" + season + "&episode=" + episode);
              }

              function showEpisodeId(id, season, episode) {
                return getJSON(omdbApi.URL + "/?i=" + id + 
                "&season=" + season + "&episode=" + episode);
              }

              function showListSearch(query, season) {
                return getJSON(omdbApi.URL + "/?t=" + encodeURIComponent(query) + 
                "&season=" + season);
              }

              function showListId(id, season) {
                return getJSON(omdbApi.URL + "/?t=" + id + 
                "&season=" + season);
              }

              var publicAPI = {
                showSearch: showSearch,
                showEpisode: showEpisode,
                showListSearch: showListSearch,
                showEpisodeId:  showEpisodeId,
                showListId: showListId
              };
              return publicAPI;
        });
})();