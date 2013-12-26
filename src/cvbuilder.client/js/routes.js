angular.module('cvbuilder.routes', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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
            .when('/login', {
                templateUrl: '/public/views/account/login.html',
                controller: 'accountController'
            })
            .when('/status/:code', {
                templateUrl: function(routeParameters) {
                    return '/public/views/status/' + routeParameters.code + ".html";
                } 
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);