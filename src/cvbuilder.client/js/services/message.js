angular.module('cvbuilder.services')
    .service('messageService', ['$rootScope', function ($rootScope) {
        $rootScope.messages = [];

        var onChange = function (event, newUrl, oldUrl) {
            var messages = [];

            _.each($rootScope.messages, function (item) {
                if (item.preserve) {
                    item.preserve = false;
                    messages.push(item);
                }
            });

            $rootScope.messages = messages;
        };

        $rootScope.$on('stateChange', onChange);
        $rootScope.$on('$locationChangeSuccess', onChange);

        return {
            addMessage: function(content, title, type, preserve) {
                $rootScope.messages.push({ content: content, title: title, type: type, preserve: preserve });

                $rootScope.$broadcast('handleMessageBroadcast');
            },

            addAlert: function(content, preserve) {
                $rootScope.messages.push({ content: content, preserve: preserve });

                $rootScope.$broadcast('handleMessageBroadcast');
            },

            messageTypes: function() {
                return [ "Alert", "Information" ];
            },

            clear: function() {
                $rootScope.messages = [];

                $rootScope.$broadcast('handleMessageBroadcast');
            },
        };
}]);