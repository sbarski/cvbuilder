angular.module('cvbuilder.interceptors')
.config(["$provide", "$httpProvider", function ($provide, $httpProvider) {

    // Intercept http calls.
    $provide.factory('HttpInterceptor', ["$q", "$location", function ($q, $location) {
        return {
            // On request success
            request: function (config) {
                // Return the config or wrap it in a promise if blank.
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

            // On response failture
            responseError: function (rejection) {
                switch(rejection.status) {
                    case 401:
                        $location.path('/status/401');
                        break;
                    case 403:
                        $location.path('/status/403');
                        break;
                    case 404:
                        $location.path('/status/404');
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