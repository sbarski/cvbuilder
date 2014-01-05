angular
    .module('cvbuilder.controllers')
    .controller('oauthController', ['$rootScope', '$routeParams', '$scope', "$location", 'cache', 'messageService', 'authService', function ($rootScope, $routeParams, $scope, $location, cache, messageService, authService) {
        //OAUTH CONTROLLER
        console.log('oauth');
        if ($routeParams.provider) {
            switch ($routeParams.provider) {
                case "google":
                    authService.loginWithGoogleAndCode($routeParams.code);
                    break;

                default:
                    break;
            }
        }

}]);
