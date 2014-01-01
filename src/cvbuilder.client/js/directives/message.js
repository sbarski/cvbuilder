angular.module('cvbuilder.directives').
  directive('message', ['messageService', function (messageService) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div ng-repeat="item in messages">{{item.content}}</div>'
    };
}]);
