angular.module('delivery.controllers')

.controller('RegisterCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

    /// <summary>closeRegister: Close the register modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.registerModal.hide();
    };

    /// <summary>doRegister: Perform the Register action when the user submits the Register form, and save user data to '$rootScope' and 'localStorage'</summary>
    /// <param>No parameters</param>
    $scope.doRegister = function () {
        $rootScope.isUserRegister = true;
        localStorage.setItem("isUserRegister", true);
        localStorage.setItem("userName", "Kameen");
        localStorage.setItem("firstName", "Kamal");
        localStorage.setItem("lastName", "Al Ameen");
        localStorage.setItem("password", "12345678");
        console.log('Doing Register', $scope.loginData);
    };
});

angular.module('delivery.directives', [])
  .directive('pwCheck', [function () {
      return {
          require: 'ngModel',
          link: function (scope, elem, attrs, ctrl) {
              var firstPassword = '#' + attrs.pwCheck;
              elem.add(firstPassword).on('keyup', function () {
                  scope.$apply(function () {
                      var v = elem.val() === $(firstPassword).val();
                      ctrl.$setValidity('pwmatch', v);
                  });
              });
          }
      }
  }]);