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
    .run(['$rootScope', '$location', '$q', 'accountService', 'messageService', function ($rootScope, $location, $q, accountService, messageService) {

    var routeRequiresAuthentication = function(next) {
        return next.data && next.data.authenticated;
    };

    var routeRequiresClaim = function(next) {
        return next.data && next.data.claims && next.data.claims.length > 0;
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        //detect logout
        $q.when(accountService.restore()).then(function (result) { //this doesn't need to be async for now but will help in the future
            if (next.$$route.templateUrl === '/public/views/account/login.html' && accountService.user().is_authenticated) {
                $location.path('/dashboard');
            }

            if (routeRequiresAuthentication(next) && !accountService.user().is_authenticated) {
                messageService.addAlert('Sorry - but you must be authenticated', true);
                $location.path('/login');
            }

            if (routeRequiresClaim(next)) {
                var check = _.find(accountService.user().details.claims, function (claim) {
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
    });
}]);