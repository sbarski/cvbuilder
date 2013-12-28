angular.module('cvbuilder.services')
    .factory('accountService', ['$http', '$location', 'base64', 'messageService', function ($http, $location, base64, messageService) {
        var user = {
            IsAuthenticated: false,
            Username: '',
            Token: '',
            TokenExpiry: ''
        };

        return {
            user: user,
            register: function() {
            },
            login: function (username, password) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password);
                return $http.post('/api/authenticate')
                    .then(function (result) {
                        //make sure that all future requests are done with the Session token
                        user.IsAuthenticated = result.data['access_token'] != null;
                        user.Token = result.data['access_token'];
                        user.TokenExpiry = result.data['expires_in'];

                        if (user.IsAuthenticated) {
                            $http.defaults.headers.common['Authorization'] = 'Session ' + user.Token; 
                        }

                        return user.IsAuthenticated;
                }, function (response) { //error
                    if (response.status === 401) {
                        messageService.add('Hello World');
                    }
                });
            }
        };
}]);