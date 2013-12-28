angular.module('cvbuilder.directives').
  directive('message', ['messageService', function (messageService) {
    return {
        restrict: 'E',
        controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
            $scope.$on('handleMessageBroadcast', function () {
                $rootScope.messages = messageService.getItems();
            });
        }],
        replace: true,
        template: '<div ng-repeat="item in messages">{{item.content}}</div>'
    };
}]);
