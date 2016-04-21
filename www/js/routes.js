(function () {
  'use strict';
  angular.module('leaderSeries')
  .config(config);

  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider){
    $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'modules/login/login.html',
      controller: 'loginController',
      data: {
        access: 'public'
      }
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'modules/signup/signup.html',
      controller: 'signupController',
      data: {
        access: 'public'
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }
})();