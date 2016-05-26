angular.module('delivery.controllers')

.controller('LoginCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, customerFactory, $state, authFactory, deliveryLoader, errorCodeMessageFactory) {
    // Form data for the login modal
    $scope.loginData = {};

    /// <summary>showLogin: Show the login modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showLogin = function () {
        $rootScope.loginModal.show();
    };

    /// <summary>closeLogin: Close the login modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.closeLogin = function () {
        $rootScope.loginModal.hide();
    };

    $scope.switchToRegister = function () {
        $scope.closeLogin();
        $rootScope.showRegister();
    };

    /// <summary>doLogin: Perform the login action when the user submits the login form, and save user data to '$rootScope' and 'localStorage'</summary>
    /// <param>No parameters</param>
    $scope.doLogin = function () {
        deliveryLoader.showLoading('Log in...');
        customerFactory.login($scope.loginData).success(function (data) {
            try{
                $rootScope.isAuthenticated = true;
                $rootScope.isUserLoggedin = true;
                $rootScope.currentCustomerId = data.id;
                $rootScope.currentCustomerUserName = data.username;
                $rootScope.currentCustomerAuthToken = data.auth_token;
                data.password = $scope.loginData.password;
                data.password_confirmation = $scope.loginData.password;
                authFactory.setCustomer(data);
                $scope.closeLogin();
            } catch (e) {
                deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(401, 'LOGIN'));
            }
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            $rootScope.isAuthenticated = false;
            authFactory.deleteAuth();
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(statusCode, 'LOGIN'));
        });
    };

    /// <summary>loginFromCart: Perform the login action when the user checkout and he is not logged in</summary>
    $scope.loginFromCart = function () {
        deliveryLoader.showLoading('Log in...');
        customerFactory.login($scope.loginData).success(function (data) {
            $rootScope.isAuthenticated = true;
            $rootScope.isUserLoggedin = true;
            $rootScope.currentCustomerId = data.id;
            $rootScope.currentCustomerUserName = data.username;
            $rootScope.currentCustomerAuthToken = data.auth_token;
            data.password = $scope.loginData.password;
            data.password_confirmation = $scope.loginData.password;
            authFactory.setCustomer(data);
            $scope.closeLogin();
            deliveryLoader.hideLoading();
            // if login successed, go to 'cart-addresses' view to continue order checkout
            $state.go('app.cart-addresses');
        }).error(function (err, statusCode) {
            $rootScope.isAuthenticated = false;
            authFactory.deleteAuth();
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(statusCode + ": " + err);
        });
    }

    /// <summary>prevStep: Redirect the user back to 'select categories' modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $scope.closeLogin();
    }

});