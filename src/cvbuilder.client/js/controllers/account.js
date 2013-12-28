angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', "$location", 'cache', 'accountService', function ($scope, $location, cache, accountService) {
    $scope.login = function(user) {
        accountService.login(user.username, user.password)
                .then(function(isAuthenticated) {
                    if (isAuthenticated) {
                        $location.path('/dashboard');
                    }
                }),
            function(response) {
            };
    };
}]);
