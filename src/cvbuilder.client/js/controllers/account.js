angular.module('cvbuilder.controllers', []);

angular
    .module('cvbuilder.controllers')
    .controller('accountController', ['$scope', 'cache', 'accountService', function ($scope, cache, accountService) {
        accountService.login('admin', 'blah')
                .then(function (token) {
                debugger;
                    console.log(token);
            }), 
                function(response) {
                    debugger;
                };
    }]);
