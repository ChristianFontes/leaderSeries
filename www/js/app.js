// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('leaderSeries', [
  'ionic',
  'ngStorage',
  'ngResource',
  'angular.filter'
])

.run(function ($ionicPlatform, $location, $state, $rootScope, $ionicHistory, AuthService) {
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
})