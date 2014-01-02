angular.module('cvbuilder.services')
    .service('authService', ['$rootScope', '$http', '$location', '$q', '$cookieStore', 'base64', 'messageService', 'userService', function ($rootScope, $http, $location, $q, $cookieStore, base64, messageService, userService) {

        var userLogout = function () {
            $cookieStore.remove('user-session');
            $http.defaults.headers.common['Authorization'] = "";
            userService.clear();
        };

        var userLogin = function(login) {
            var config = {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(login.username + ':' + login.password),
                    'Accept': 'application/json;odata=verbose',
                }
            };

            return $http.post('/api/authenticate', null, config) //authenticate
                .then(function (result) {
                    var user = userService.user();

                    user.token = result.data['access_token'];
                    user.token_expiry = result.data['expires_in'];
                    user.is_authenticated = user.token !== null;

                    $http.defaults.headers.common['Authorization'] = 'Session ' + user.token;

                    userService.getUserDetails().then(function () {
                        var current = userService.user();
                        $cookieStore.put('user-session', current);
                        $location.path('/dashboard');
                    });

                }, function (error) { //error
                    messageService.addAlert('Could not login', false);
                });
        };

        $rootScope.$on('logout', function(e, args) {
            userLogout();
        });

        return {
            logout: function () {
                $http.post('/api/logout');
                userLogout();
            },
            login: function (data) {
                return userLogin(data);
            },
            register: function (data) {
                var auth = base64.encode(data.username + ':' + data.password);

                var config = {
                    headers: {
                        'Authorization' : null,
                        'Accept': 'application/json;odata=verbose',
                    }
                };

                return $http.put('/api/register', { "cred": auth }, config).then(function (result) {
                    return userLogin(data);
                }, function (error) {
                    messageService.addAlert(error.data["message"], false);
                });
            },
            storeToCookie: function () {
                var user = userService.user();

                $cookieStore.put('user-session', user);
            },
            restoreFromCookie: function () {
                var user = userService.user();

                if (user.is_authenticated) {
                    return true;
                }

                var defer = $q.defer();

                var restored = $cookieStore.get('user-session');
                if (restored) {
                    userService.setUser(restored);
                    $http.defaults.headers.common['Authorization'] = 'Session ' + user.token;
                }

                if (defer) {
                    defer.resolve();
                }

                return defer.promise;
            }
        };
}]);