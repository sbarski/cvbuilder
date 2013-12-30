angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', "$location", 'cache', 'messageService', 'accountService', function ($scope, $location, cache, messageService, accountService) {
    $scope.login = function (user) {
        if (!user || !user.username || !user.password) {
            messageService.clear();
            messageService.addAlert("Please type your username and password", false);
            return;
        }

        accountService
            .login(user.username, user.password)
            .then(function(authenticatedUser) { //authenticate 
            if (authenticatedUser && authenticatedUser.is_authenticated) {
                $location.path('/dashboard');
            } else {
                //messageService.add('Could not login and authenticate');
            }
        });
    };
}]);
