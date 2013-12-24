var app = angular.module('cvbuilder.config', []);

app.factory('cache', [
    '$cacheFactory', function($cacheFactory) {
        var cache = $cacheFactory('cvbuilder-cache');
        return cache;
    }
]);