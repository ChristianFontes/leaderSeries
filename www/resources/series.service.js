(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('Series', function ($resource, apiSeries) {
            
            var rootURL = "http://api.tvmaze.com";
              
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
                return getJSON(rootURL + "/search/shows?q=" + encodeURIComponent(query));
              }
              
              function singleSearch(query) {
                return getJSON(rootURL + "/singlesearch/shows?q=" +
                  encodeURIComponent(query));
              }
              
              function showLookup(id, source) {
                return getJSON(rootURL + "/lookup/shows?" + source + "=" + id);
              }

              function peopleSearch(query) {
                return getJSON(rootURL + "/search/people?q=" + encodeURIComponent(query));
              }

              function schedule(countryCode, date) {
                var schedURL = "/schedule";
                if(countryCode && date) {
                  schedURL += "?country=" + countryCode + "&date=" + date;
                }
                else if (countryCode && !date) {
                  schedURL += "?country=" + countryCode;
                }
                else if (!countryCode && date) {
                  schedURL += "?date=" + date;
                }
                return getJSON(rootURL + schedURL);
              }
              
              function fullSchedule() {
                return getJSON(rootURL + "/schedule/full");
              }

              function shows(id) {
                return getJSON(rootURL + "/shows/" + id);
              }

              function showEpisodeList(id, specials) {
                var apiURL = "/shows/" + id + "/episodes";
                if (specials) {
                  apiURL += "?specials=1";
                }
                return getJSON(rootURL + apiURL);
              }

              function episodeByNumber(id, season, episode) {
                return getJSON(rootURL + "/shows/" + id + "/episodebynumber?season=" +
                  season + "&number=" + episode);
              }

              function episodeByDate(id, date) {
                return getJSON(rootURL + "/shows/" + id + "/episodesbydate?date=" + date);
              }

              function showCast(id) {
                return getJSON(rootURL + "/shows/" + id + "/cast");
              }

              function showAKAs(id) {
                return getJSON(rootURL + "/shows/" + id + "/akas");
              }

              function showIndex(pageNumber) {
                return getJSON(rootURL + "/shows?page=" + pageNumber);
              }

              function personInfo(id, embed) {
                var apiURL = "/people/" + id;
                if (embed) {
                  apiURL += "?embed=castcredits";
                }
                return getJSON(rootURL + apiURL);
              }

              function personCastCredits(id, embed) {
                var apiURL = "/people/" + id + "/castcredits";
                if (embed) {
                  apiURL += "?embed=show";
                }
                return getJSON(rootURL + apiURL);
              }

              function personCrewCredits(id, embed) {
                var apiURL = "/people/" + id + "/crewcredits";
                if (embed) {
                  apiURL += "?embed=show";
                }
                return getJSON(rootURL + apiURL);
              }

              function showUpdates() {
                return getJSON(rootURL + "/updates/shows");
              }
              var publicAPI = {
                showSearch: showSearch,
                singleSearch: singleSearch,
                showLookup: showLookup,
                peopleSearch: peopleSearch,
                schedule: schedule,
                fullSchedule: fullSchedule,
                shows: shows,
                showEpisodeList: showEpisodeList,
                episodeByNumber: episodeByNumber,
                episodeByDate: episodeByDate,
                showCast: showCast,
                showAKAs: showAKAs,
                showIndex: showIndex,
                personInfo: personInfo,
                personCastCredits: personCastCredits,
                personCrewCredits: personCrewCredits,
                showUpdates: showUpdates
              };
              return publicAPI;
        });
})();