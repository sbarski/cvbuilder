angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', 'cache', 'accountService', function ($scope, cache, accountService) {
        accountService.login('admin', 'password')
                .then(function (token) {
                debugger;
                    console.log(token);
            }), 
                function(response) {
                    debugger;
                };
    }]);
