(function () {
    'use strict';

    angular.module('leaderSeries')
        .factory('AuthService', authServiceFactory)
        .factory('AuthInterceptor', authInterceptorFactory)
        .config(["$httpProvider", function ($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        }]);

    function authServiceFactory($http, $sessionStorage, apiBackend, $state) {
        return {
            authorize: function (access) {
                return access === 'public' || access === 'protected' && $sessionStorage.sessionUser;
            },
            isAuthenticated: function () {
                return $sessionStorage.sessionUser.token;
            },
            login: function (credentials) {
                var login = $http.post(apiBackend.URL + '/login', credentials);
                login.success(function (result) {
                    $sessionStorage.sessionUser = result;
                });
                return login;
            },
            logout: function () {
                delete $sessionStorage.sessionUser;
                delete $sessionStorage.currentProject;
                $state.go('login');
            }
        };
    }

    function authInterceptorFactory($sessionStorage, $injector, $q) {
        return {
            request: function (config) {
                var token = $sessionStorage.sessionUser ?
                    $sessionStorage.sessionUser.token : undefined;
                if (token) {
                    config.headers.Authorization = token;
                }
                return config;
            },
            responseError: function (response) {
                if (response.status === 401 || response.status === 403) {
                    delete $sessionStorage.sessionUser;
                    $injector.get('$state').go('login');
                }
                return $q.reject(response);
            }
        };
    }
})();