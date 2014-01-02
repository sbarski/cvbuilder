angular
    .module('cvbuilder.controllers')
    .controller('registerController', ['$rootScope', '$scope', "$location", 'cache', 'messageService', 'authService', function ($rootScope, $scope, $location, cache, messageService, authService) {

    $scope.register = function(user) {
        authService.register(user);
    };
}]);
