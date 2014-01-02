angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', "$location", 'cache', 'messageService', 'userService', function ($scope, $location, cache, messageService, userService) {

    $scope.user = userService.user().details;

    $scope.update = function (user, password) {
        userService.update(user, password);
    };

    $scope.delete = function (user) {
        userService.delete(user);
    };
}]);
