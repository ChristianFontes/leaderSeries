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
    })
    .state('series.mySeries', {
      url: '/my-series',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/mySeries/series/mySeries.html',
          controller: 'mySeriesController'
        }
      }
    })
    .state('series.mySeriesEpisodes', {
      url: '/my-series-episodes',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/mySeries/series/episodes/episodes.html',
          controller: 'episodesController'
        }
      }
    })
    .state('series.mySeriesToday', {
      url: '/my-series-today',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/mySeries/seriesToday/mySeriesToday.html',
          controller: 'mySeriesController'
        }
      }
    })
    .state('series.currentSerie', {
      url: '/current-serie',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/currentSerie/currentSerie.html',
          controller: 'currentSerieController'
        }
      }
    })
    .state('series.premieres', {
      url: '/premieres',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/premieres/premieres.html',
          controller: 'premieresController'
        }
      }
    })
    .state('series.casting', {
      url: '/casting',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/casting/casting.html',
          controller: 'castingController'
        }
      }
    })
    .state('series.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'modules/profile/profile.html',
          controller: 'profileController'
        }
      }
    })
    .state('series.infoSerie', {
      url: '/infoserie',
      views: {
        'menuContent': {
          templateUrl: 'modules/series/dashboard/infoSerie/infoSerie.html',
          controller: 'infoSerieController'
        }
      }
    })
    .state('series.recommend', {
      url: '/recommend',
      views: {
        'menuContent': {
          templateUrl: 'modules/recommend/recommend.html',
          controller: 'recommendController'
        }
      }
    })
    .state('series.activity', {
      url: '/activity',
      views: {
        'menuContent': {
          templateUrl: 'modules/activity/activity.html',
          controller: 'activityController'
        }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }
})();