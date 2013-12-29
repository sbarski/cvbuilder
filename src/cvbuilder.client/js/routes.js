angular.module('cvbuilder.routes', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.when('/', {
                templateUrl: '/public/views/home/frontpage.html',
            })
            .when('/about', {
                templateUrl: '/public/views/home/about.html'
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
                },
                data: {
                    authenticated: true
                }
            })
            .when('/dashboard', {
                templateUrl: '/public/views/protected/dashboard.html',
                data: {
                    authenticated: true,
                    claims: [{ 'action': 'access', 'resource': 'dashboard' }]
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);