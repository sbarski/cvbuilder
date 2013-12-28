angular.module('cvbuilder.services')
    .factory('accountService', ['$http', '$location', 'base64', 'messageService', function ($http, $location, base64, messageService) {
        var user = {
            IsAuthenticated: false,
            Username: '',
            Token: '',
            TokenExpiry: '',
            FullName: '',
            Photo: ''
        };

        var populateAccountInformation = function () {
            return $http.get('/api/account')
                .then(function (result) {
                    user.FullName = result.data['name'];
                    user.Photo = result.data['photo'];
            }), function (error) {
                    messageService.add(error.status);
                };
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

                        if (user.IsAuthenticated) {

                            user.Token = result.data['access_token'];
                            user.TokenExpiry = result.data['expires_in'];

                            $http.defaults.headers.common['Authorization'] = 'Session ' + user.Token;
                            user.FullName = 'MEMEME';
                            populateAccountInformation();
                        }

                    return user.IsAuthenticated;
                }, function (response) { //error
                    if (response.status === 401) {
                        messageService.add('Hello World');
                    }
                });
            },
        };
}]);