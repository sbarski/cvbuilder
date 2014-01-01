angular.module('cvbuilder.services')
    .service('accountService', ['$rootScope', '$http', '$location', '$q', '$cookieStore', 'base64', 'messageService', function ($rootScope, $http, $location, $q, $cookieStore, base64, messageService) {
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

        var processUserInformation = function(result) {
            user.details = result.data;
            return user;
        };

        var userLogout = function() {
            $cookieStore.remove('user-session');
            $http.defaults.headers.common['Authorization'] = "";
            user = userFactory().create();
        };

        $rootScope.$on('logout', function(e, args) {
            userLogout();
        });

        return {
            user: function() {
                return user;
            },
            logout: function () {
                $http.post('/api/logout');
                userLogout();
            },
            register: function(username, password) {
                return $http.put('/api/register', {
                    username: username,
                    password: password
                }).then(function (result) {
                    messageService.addAlert('Could not register you with the system', false);
                });
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
            login: function (username, password) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password);

                return $http.post('/api/authenticate') //authenticate
                .then(function (result) {
                    return processAuthentication(result); //process returned data
                }, function (error) { //error
                    messageService.addAlert('Could not login', false);
                });
            },
            getUserDetails: function() {
                return $http.get('/api/account')
                .then(function(result) {
                    return processUserInformation(result);
                }, function (error) {
                    messageService.addAlert('Could not get user information', false);
                });
            },
            store: function() {
                $cookieStore.put('user-session', user);
            },
            restore: function () {
                if (user.is_authenticated) {
                    return true;
                }

                var defer = $q.defer();
                
                var restored = $cookieStore.get('user-session');
                if (restored) {
                    user = restored;
                    $http.defaults.headers.common['Authorization'] = 'Session ' + user.token;
                }
                
                if (defer) {
                    defer.resolve();
                }

                return defer.promise;
            }
        };
}]);