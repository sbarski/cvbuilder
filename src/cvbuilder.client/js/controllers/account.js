angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', 'cache', 'accountService', function ($scope, cache, accountService) {
    $scope.login = function(user) {
        accountService.login(user.username, user.password)
                .then(function(result) {

                }),
            function(response) {
                debugger;
            };
    };
}]);
