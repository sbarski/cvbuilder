angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', 'cache', 'accountService', 'userService', function ($scope, cache, accountService, userService) {
        accountService.login('admin', 'admin')
                .then(function (result) {

            }), 
                function(response) {
                    debugger;
                };
    }]);
