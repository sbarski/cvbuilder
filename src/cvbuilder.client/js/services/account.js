angular.module('cvbuilder.services')
    .factory('accountService', ['$http', function ($http) {
    return {
        register: function() {

        },
        login: function (username, password) {
            var config = {
                headers: {
                    'Authorization': 'Basic ' + Base64.encode(username + ':' + password),
                    'Accept': 'application/json;odata=verbose'
                }
            };
            return $http.get('/api/version/token', config)
                .then(function (result) {
                    return result.token;
                }, function (response) { //error
                    debugger;
                });
        }
    };
}]);