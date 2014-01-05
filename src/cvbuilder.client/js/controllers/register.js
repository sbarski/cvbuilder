angular
    .module('cvbuilder.controllers')
    .controller('registerController', ['$rootScope', '$routeParams', '$scope', "$location", 'cache', 'messageService', 'authService', function ($rootScope, $routeParams, $scope, $location, cache, messageService, authService) {


    $scope.register = function(user) {
        authService.register(user);
    };
}]);
