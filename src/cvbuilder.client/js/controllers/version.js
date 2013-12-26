angular
    .module('cvbuilder.controllers')
    .controller('versionController', ['$scope', 'cache', 'versionService', function ($scope, cache, versionService) {
        var cachedVersion = cache.get('version');
        
        if (cachedVersion != null) {
            $scope.version = cachedVersion;
        } else {
            $scope.version = versionService.getVersion()
                .then(function (version) {
                    $scope.version = version;
                    cache.put('version', version);
            });
        }
    }]);
