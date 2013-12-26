angular.module('cvbuilder.services')
    .factory('accountService', ['$http', 'base64', function ($http, base64) {
    return {
        register: function() {

        },
        login: function (username, password) {
            var config = {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(username + ':' + password),
                    'Accept': 'application/json;odata=verbose'
                }
            };
            return $http.post('/api/login', config)
                .then(function (result) {
                debugger;
                    return result.token;
                }, function (response) { //error
                    debugger;
                });
        }
    };
}]);