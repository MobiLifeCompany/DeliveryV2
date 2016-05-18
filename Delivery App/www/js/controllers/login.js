angular.module('delivery.controllers')

.controller('LoginCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    /// <summary>closeLogin: Close the login modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.closeLogin = function () {
        $rootScope.loginModal.hide();
    };

    /// <summary>doLogin: Perform the login action when the user submits the login form, and save user data to '$rootScope' and 'localStorage'</summary>
    /// <param>No parameters</param>
    $scope.doLogin = function () {
        $rootScope.isUserLoggedin = true;
        localStorage.setItem("isUserLoggedin", true);
        localStorage.setItem("userName", "Nawar Albarazi");
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };

    /// <summary>prevStep: Redirect the user back to 'select categories' modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $scope.closeLogin();
    }

});