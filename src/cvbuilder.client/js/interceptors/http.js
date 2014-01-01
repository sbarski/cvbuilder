angular.module('cvbuilder.interceptors')
.config(["$provide", "$httpProvider", function ($provide, $httpProvider) {

    // Intercept http calls.
    $provide.factory('HttpInterceptor', ["$rootScope", "$q", "$location", 'messageService', function ($rootScope, $q, $location, messageService) {
        return {
            // On request success
            request: function (config) {
                //if (userService != null && userService.token != null && userService.IsAuthenticated) {
                //    config.headers["Authorization"] = 'Session ' + userService.Token;
                //}

                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                // Return the response or promise.
                return response || $q.when(response);
            },

            // On response failure
            responseError: function (rejection) {
                switch (rejection.status) {
                case 403:
                    messageService.addAlert("Sorry - you are forbidden to access this resource", true);
                    $location.path('/status/403');
                    break;
                case 404:
                    messageService.addAlert("Sorry - this page wasn't found", true);
                    $location.path('/status/404');
                    break;
                case 406: //re-validate again
                    $rootScope.$broadcast('logout');
                    messageService.addAlert("Sorry - you have been signed out. Please login again.", true);
                    $location.path('/login');
                    break;
                }
                    

                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    }]);


    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('HttpInterceptor');
}]);