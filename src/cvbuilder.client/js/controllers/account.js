angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', "$location", 'cache', 'messageService', 'accountService', function ($scope, $location, cache, messageService, accountService) {
    $scope.login = function(user) {
        accountService
            .login(user.username, user.password)
            .then(function (authenticatedUser) { //authenticate 
                    if (authenticatedUser && authenticatedUser.is_authenticated) {
                        $location.path('/dashboard');
                    } else {
                        messageService.add('Could not login and authenticate');
                    }
                }, function (error) { //error

                });
    };
}]);
