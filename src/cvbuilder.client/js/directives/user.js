angular.module('cvbuilder.directives').
  directive('user', ['accountService', function (accountService) {
    return {
        restrict: 'AE',
        scope: {
          ngModel: '='  
        },
        controller: ['$scope', function ($scope) {
            $scope.user = accountService.user;
            console.log($scope.user);
        }],
        replace: true,
        templateUrl: '/public/views/protected/partials/user.html' //working
    };
}]);
