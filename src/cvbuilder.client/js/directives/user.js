angular.module('cvbuilder.directives').
  directive('user', ['$location', 'accountService', function ($location, accountService) {
    return {
        restrict: 'AE',
        scope: {
          ngModel: '='  
        },
        controller: ['$scope', function ($scope) {
            $scope.user = accountService.user().details;

            $scope.logout = function() {
                accountService.logout();
                $scope.user = {};
            };
        }],
        replace: true,
        templateUrl: '/public/views/protected/partials/user.html',
        link: function (scope, element, attrs, controller) {
        }
    };
}]);
