(function(){
   'use strict';
   
   angular.module('leaderSeries')
        .constant('apiBackend', {
            URL: 'http://107.180.66.6:1337' //goDaddy Cloud sails backend
            //URL: 'http://192.168.43.161:1337' //local sails backend 
        });
})();