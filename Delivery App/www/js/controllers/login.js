angular.module('delivery.controllers')

.controller('LoginCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, UserFactory, deliveryLoader) {
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
        var userName = "";
        deliveryLoader.showLoading('Log in...');
   //     var requestData = '{\"customer\":{\"username": \"'+$scope.loginData.username+'\",\"password": \"'+$scope.loginData.password+'\"}}';
        UserFactory.login($scope.loginData).success(function (data) {
            userName = data.full_name;
            $rootScope.isAuthenticated = true;
            $rootScope.isUserLoggedin = true;
            localStorage.setItem("isUserLoggedin", true);
            localStorage.setItem("userName", userName);
            $scope.closeLogin();
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(statusCode +": " + err);
        });
    };

    /// <summary>prevStep: Redirect the user back to 'select categories' modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $scope.closeLogin();
    }

});