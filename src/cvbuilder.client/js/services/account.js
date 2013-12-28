angular.module('cvbuilder.services')
    .factory('accountService', ['$http', 'base64', 'userService', function ($http, base64, userService) {
    return {
        register: function() {

        },
        login: function (username, password) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password); //will only be present in this scope
            return $http.post('/api/authenticate')
                .then(function (result) {

                    //make sure that all future requests are done with the Session token
                    userService.IsAuthenticated = result.data['access_token'] != null;
                    userService.Token = result.data['access_token'];
                    userService.TokenExpiry = result.data['expires_in'];

                    return userService.IsAuthenticated;
            }, function (response) { //error
                    debugger;
                });
        }
    };
}]);