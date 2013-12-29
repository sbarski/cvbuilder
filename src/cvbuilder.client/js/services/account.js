angular.module('cvbuilder.services')
    .factory('accountService', ['$http', '$location', '$q', 'base64', 'messageService', function ($http, $location, $q, base64, messageService) {
        var user = {
            is_authenticated: false,
            username: '',
            token: '',
            token_expiry: '',
            details: {
                first_name: '',
                last_name: '',
                photo: '',
                claims: []
            }
        };

        var processAuthentication = function(result) {
            user.is_authenticated = result.data['access_token'] != null;
            if (user.is_authenticated) {

                user.token = result.data['access_token'];
                user.token_expiry = result.data['expires_in'];

                $http.defaults.headers.common['Authorization'] = 'Session ' + user.token;
            } else {
                $q.reject('An error occurrred during authentication');
            }

            return user;
        };

        return {
            user: user,
            register: function() {},
            login: function (username, password) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password);
                return $http.post('/api/authenticate') //authenticate
                    .then(function (result) {
                        return processAuthentication(result); //process returned data
                    }).then(function (userInformation) {
                        return $http.get('/api/account'); //get user information
                    }).then(function (result) {
                        user.details.first_name = result.data['first_name']; //process user information
                        user.details.last_name = result.data['last_name'];
                        user.details.photo = result.data['photo'];
                        user.details.claims = result.data['claims'];
                        return user;
                }, function (error) { //error
                        if (error.status === 401) {
                            messageService.addAlert('Unauthorized Login', false);
                        }
                });
            }
        };
}]);