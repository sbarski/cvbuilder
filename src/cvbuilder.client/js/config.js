angular.module('cvbuilder.config', []).factory('cache', [
    '$cacheFactory', function($cacheFactory) {
        var cache = $cacheFactory('cvbuilder-cache');
        return cache;
    }
]);