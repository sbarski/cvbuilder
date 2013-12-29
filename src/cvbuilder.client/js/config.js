angular
    .module('cvbuilder.config', [])
    .factory('cache', [
        '$cacheFactory', function($cacheFactory) {
            var cache = $cacheFactory('cvbuilder-cache');
            return cache;
        }
]);

angular
    .module('cvbuilder.config')
    .run(['$rootScope', '$location', 'accountService', 'messageService', function ($rootScope, $location, accountService, messageService) {

    var routeRequiresAuthentication = function(next) {
        return next.data && next.data.authenticated;
    };

    var routeRequiresClaim = function(next) {
        return next.data && next.data.claims && next.data.claims.length > 0;
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // if route requires auth and user is not logged in
        if (routeRequiresAuthentication(next) && !accountService.user.is_authenticated) {
            messageService.addAlert('Sorry - but you must be authenticated', true);
            $location.path('/login');
            return;
        }

        if (routeRequiresClaim(next)) {
            var check = _.find(accountService.user.details.claims, function (claim) {
                return _.find(next.data.claims, function (route) {
                    return route.resource === claim.resource && route.action === claim.action;
                });
            });

            if (!check || check.length === 0) {
                messageService.addAlert('Sorry - but you do not have the right permissions to access this resource', true);
                $location.path('/login');
            }
        }
    });
}]);