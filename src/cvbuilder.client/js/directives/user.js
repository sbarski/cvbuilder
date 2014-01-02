angular.module('cvbuilder.directives').
  directive('user', ['$location', 'authService', 'userService', function ($location, authService, userService) {
    return {
        restrict: 'AE',
        scope: {
          ngModel: '='  
        },
        controller: ['$scope', function ($scope) {
            $scope.user = userService.user().details;

            $scope.logout = function() {
                authService.logout();
                $scope.user = {};
                $location.path('/');
            };
        }],
        replace: true,
        templateUrl: '/public/views/protected/partials/user.html',
        link: function (scope, element, attrs, controller) {
        }
    };
}]);
