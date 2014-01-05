angular
    .module('cvbuilder.controllers')
    .controller('loginController', ['$rootScope', '$routeParams', '$scope', "$location", 'cache', 'messageService', 'authService', function ($rootScope, $routeParams, $scope, $location, cache, messageService, authService) {
        if ($routeParams.provider) {
            switch ($routeParams.provider) {
                case "google":
                    authService.loginWithGoogle();
                    break;

                default:
                    break;
            }
        }


        $scope.login = function (user) {
            authService.login(user);
        };
}]);
