angular.module('cvbuilder.services')
    .service('userService', ['$rootScope', '$http', '$location', '$q', '$cookieStore', 'base64', 'messageService', function ($rootScope, $http, $location, $q, $cookieStore, base64, messageService) {
        var userFactory = function () {
            return {
                create: function() {
                    return {
                        is_authenticated: false,
                        token: '',
                        token_expiry: '',
                        details: {
                            first_name: '',
                            last_name: '',
                            photo: '',
                            username: '',
                            claims: []
                        }
                    };
                }
            };
        };

        var user = userFactory().create();

        var currentUser = function() {
            return user;
        };

        return {
            isAuthenticated: function (){
                return user !== undefined && user.is_authenticated;  
            },
            user: function() {
                return currentUser();
            },
            setUser: function(restoredUser) {
                user = restoredUser;
            },
            clear: function() {
                user = userFactory().create();
            },
            update: function(details, password) {
                return $http.post('/api/account/update', {
                    user: details,
                    password: base64.encode(password === undefined ? '' : password)
                }).then(function(result) {
                    messageService.addMessage('Your details have been successfully updated');
                }, function(failure) {
                    messageService.addAlert('Failed to update your account. Please try again.', false);
                });
            },
            getUserDetails: function() {
                return $http.get('/api/account')
                .then(function (result) {
                    user.details = result.data;
                }, function (error) {
                    messageService.addAlert('Could not get user information', false);
                });
            },
        };
}]);