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
    })
    .state('series', {
      url: '/series',
      abstract: true,
      templateUrl: 'templates/side-menu.html',
      data: {
        access: 'protected'
      }
    })
    .state('series.Dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/dashboard/dashboard.html',
          controller: 'seriesDashboardController'
        }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }
})();