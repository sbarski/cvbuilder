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
                templateUrl: '/public/views/home/register.html',
                controller: 'registerController'
            })
            .when('/login', {
                templateUrl: '/public/views/home/login.html',
                controller: 'loginController'
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
            .when('/account', {
                templateUrl: 'public/views/protected/account/manage.html',
                data: {
                    authenticated: true
                },
                controller: 'accountController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);