﻿angular.module('cvbuilder.routes', []).config([
    '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.when('/', {
                templateUrl: '/public/views/site/frontpage.html'
            })
            .when('/about', {
                templateUrl: '/public/views/site/about.html'
            })
            .when('/register', {
                templateUrl: '/public/views/account/register.html',
                controller: 'accountController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);