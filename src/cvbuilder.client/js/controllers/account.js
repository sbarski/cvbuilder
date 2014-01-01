angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', "$location", 'cache', 'messageService', 'accountService', function ($scope, $location, cache, messageService, accountService) {

    $scope.user = accountService.user().details;

    $scope.update = function (user, password) {
        accountService.update(user, password);
    };

    $scope.delete = function (user) {
        accountService.delete(user);
    };
}]);
