angular
    .module('cvbuilder.controllers')
    .controller('loginController', ['$rootScope', '$scope', "$location", 'cache', 'messageService', 'authService', function ($rootScope, $scope, $location, cache, messageService, authService) {
        $scope.login = function(user) {
            authService.login(user);
        };
}]);
