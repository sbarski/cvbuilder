angular.module('cvbuilder.services')
    .service('accountService', ['$rootScope', '$http', '$location', '$q', '$cookieStore', 'base64', 'messageService', function ($rootScope, $http, $location, $q, $cookieStore, base64, messageService) {

        var userFactory = function () {
            return {
                create: function() {
                    return {
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
            user.details.first_name = result.data['first_name']; //process user information
            user.details.last_name = result.data['last_name'];
            user.details.photo = result.data['photo'];
            user.details.claims = result.data['claims'];

            return user;
        };

        var storeUserSessionToCookie = function() {
            $cookieStore.put('user-session', user);
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
                $http.post('/api/account/logout');
                userLogout();
            },
            register: function() {},
            login: function (username, password) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password);
                return $http.post('/api/authenticate') //authenticate
                    .then(function (result) {
                        return processAuthentication(result); //process returned data
                    }).then(function (userInformation) {
                        return $http.get('/api/account/details'); //get user information
                    }).then(function (result) {
                        return processUserInformation(result);
                    }).then(function(userInformation) {
                        return storeUserSessionToCookie();
                }, function (error) { //error
                        if (error.status === 401) {
                            messageService.addAlert('Unauthorized Login', false);
                        }
                });
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