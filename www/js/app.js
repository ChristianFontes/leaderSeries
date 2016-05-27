// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('leaderSeries', [
  'ionic',
  'ngStorage',
  'ngResource',
  'ng.group',
  'ngCordova'
])

/*
.run(['admobSvc', function (admobSvc) {
    admobSvc.createBannerView();
}]);*/

.run(function ($ionicPlatform, $location, $state, $rootScope, $ionicHistory, 
  AuthService, RequestsService, $cordovaDevice, $cordovaPush, $sessionStorage) {
    $ionicPlatform.ready(function () {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!AuthService.authorize(toState.data.access)) {
                event.preventDefault();
                $state.go('login');
            }
        });
        $rootScope.platform = ionic.Platform.platform();

        $rootScope.goBack = function () {
            $ionicHistory.goBack();
        }

        window.onNotification,window.errorHandler, pushNotification = window.plugins.pushNotification, pushNotification.register

        pushNotification = window.plugins.pushNotification;

        window.onNotification = function(e){
          switch(e.event){
            case 'registered':
              if(e.regid.length > 0){
                var device_token = e.regid;
                //$sessionStorage.device_token = device_token;
                RequestsService.register(device_token).then(function(response){
                  //alert('registered!');
                });
              }
            break;

            case 'message':
              //alert('msg received: ' + e.message);
            break;

            case 'error':
              //alert('error occured');
            break;
          }
        };

        window.errorHandler = function(error){
          alert('an error occured');
        };

        pushNotification.register(
          onNotification,
          errorHandler,
          {
            'badge': 'true',
            'sound': 'true',
            'alert': 'true',
            'ecb': 'onNotification',
            'senderID': '761596609943',
          }
        );

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});