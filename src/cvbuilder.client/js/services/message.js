angular.module('cvbuilder.services')
    .factory('messageService', ['$rootScope', function ($rootScope) {
        var messageService = [];

        return {
            add: function(content, title, type, preserve) {
                messageService.push({ content: content, title: title, type: type, preserve: preserve });

                $rootScope.$broadcast('handleMessageBroadcast');
            },

            getItems: function () {
                return messageService.slice(); //return a copy of the array thus making it immutable
            },

            clear: function() {
                messageService = [];

                $rootScope.$broadcast('handleMessageBroadcast');
            },
        };
}]);