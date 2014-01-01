angular
    .module('cvbuilder.controllers')
    .controller('registerController', ['$scope', "$location", 'cache', 'messageService', 'accountService', function ($scope, $location, cache, messageService, accountService) {

    $scope.register = function(user) {
        accountService.register(user.username, user.password);
    };
}]);
