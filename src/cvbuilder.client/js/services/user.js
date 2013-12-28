angular.module('cvbuilder.services')
    .factory('userService', [function () {
        var user = {
            IsAuthenticated: false,
            Username: '',
            Token: '',
            TokenExpiry: ''
        };

    return user;
}]);