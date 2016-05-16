(function(){
   'use strict';
   
   angular.module('leaderSeries')
        .constant('apiBackend', {
        	URL: 'https://leaderseriesbackend.herokuapp.com' //remote sails backend
            //URL: 'http://localhost:1337' //local sails backend
            //URL: 'http://192.168.43.161:1337' //local sails backend 
        });
})();