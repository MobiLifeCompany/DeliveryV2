angular.module('delivery.controllers')

.controller('LoginCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, customerFactory, authFactory, deliveryLoader) {
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
        customerFactory.login($scope.loginData).success(function (data) {
            userName = data.username;
            $rootScope.isAuthenticated = true;
            $rootScope.isUserLoggedin = true;
            $rootScope.currentCustomerId = data.id;
            $rootScope.currentCustomerUserName = data.username;
            $rootScope.currentCustomerAuthToken = data.auth_token;
            authFactory.setCustomer(data);
            $scope.closeLogin();
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            $rootScope.isAuthenticated = false;
            authFactory.deleteAuth();
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