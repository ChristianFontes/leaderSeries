(function () {
    'use strict';
    angular.module('leaderSeries')
        .factory('Series', function ($resource, apiSeries) {
            
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
                return getJSON(apiSeries.URL + "/search/shows?q=" + encodeURIComponent(query));
              }
              
              function singleSearch(query) {
                return getJSON(apiSeries.URL + "/singlesearch/shows?q=" +
                  encodeURIComponent(query));
              }
              
              function showLookup(id, source) {
                return getJSON(apiSeries.URL + "/lookup/shows?" + source + "=" + id);
              }

              function peopleSearch(query) {
                return getJSON(apiSeries.URL + "/search/people?q=" + encodeURIComponent(query));
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
                return getJSON(apiSeries.URL + schedURL);
              }
              
              function fullSchedule() {
                return getJSON(apiSeries.URL + "/schedule/full");
              }

              function shows(id) {
                return getJSON(apiSeries.URL + "/shows/" + id);
              }

              function showEpisodeList(id, specials) {
                var apiURL = "/shows/" + id + "/episodes";
                if (specials) {
                  apiURL += "?specials=1";
                }
                return getJSON(apiSeries.URL + apiURL);
              }

              function episodeByNumber(id, season, episode) {
                return getJSON(apiSeries.URL + "/shows/" + id + "/episodebynumber?season=" +
                  season + "&number=" + episode);
              }

              function episodeByDate(id, date) {
                return getJSON(apiSeries.URL + "/shows/" + id + "/episodesbydate?date=" + date);
              }

              function showCast(id) {
                return getJSON(apiSeries.URL + "/shows/" + id + "/cast");
              }

              function showAKAs(id) {
                return getJSON(apiSeries.URL + "/shows/" + id + "/akas");
              }

              function showIndex(pageNumber) {
                return getJSON(apiSeries.URL + "/shows?page=" + pageNumber);
              }

              function personInfo(id, embed) {
                var apiURL = "/people/" + id;
                if (embed) {
                  apiURL += "?embed=castcredits";
                }
                return getJSON(apiSeries.URL + apiURL);
              }

              function personCastCredits(id, embed) {
                var apiURL = "/people/" + id + "/castcredits";
                if (embed) {
                  apiURL += "?embed=show";
                }
                return getJSON(apiSeries.URL + apiURL);
              }

              function personCrewCredits(id, embed) {
                var apiURL = "/people/" + id + "/crewcredits";
                if (embed) {
                  apiURL += "?embed=show";
                }
                return getJSON(apiSeries.URL + apiURL);
              }

              function showUpdates() {
                return getJSON(apiSeries.URL + "/updates/shows");
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