angular.module('cvbuilder.services')
    .service('versionService', ['$http', function ($http) {
        return {
            getVersion: function() {
                return $http.get('/api/version')
                    .then(function(result) {
                        return result.data.Message;
                    }, function (response) { //error
                    debugger;
                });
            }
        };
}]);