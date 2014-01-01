angular
    .module('cvbuilder.controllers')
    .controller('loginController', ['$scope', "$location", 'cache', 'messageService', 'accountService', function ($scope, $location, cache, messageService, accountService) {

        var authenticateUser = function(user) {
            return accountService.login(user.username, user.password);
        };

        var getUserInformation = function() {
            return accountService.getUserDetails();
        };

        var storeToCookie = function() {
            return accountService.store();
        };

        $scope.$on('user-authenticated', function(result) {
            getUserInformation().then(function(user) {
                storeToCookie();
                $location.path('/dashboard');
            });
        });

        $scope.login = function (user) {
            authenticateUser(user).then(function () {
                $scope.$broadcast('user-authenticated');
            });
        };
}]);
