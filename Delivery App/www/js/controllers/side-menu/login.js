angular.module('delivery.controllers')

.controller('LoginCtrl', function ($scope, $rootScope, $ionicLoading, $timeout,$ionicPopup, customerFactory, $translate, $state, connectionFactory, authFactory, deliveryLoader, errorCodeMessageFactory) {
    // Form data for the login modal
    $scope.loginData = {};


    /// <summary>closeLogin: Close the login modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.closeLogin = function () {
        $rootScope.loginModal.remove();
    };

    $scope.switchToRegister = function () {
        //$scope.closeLogin();
        $rootScope.showRegister();
    };

    /// <summary>doLogin: Perform the login action when the user submits the login form, and save user data to '$rootScope' and 'localStorage'</summary>
    /// <param>No parameters</param>
    $scope.doLogin = function () {
        customerFactory.login($scope.loginData).success(function (data) {
            try {
                $rootScope.isAuthenticated = true;
                $rootScope.isUserLoggedin = true;
                $rootScope.currentCustomerId = data.id;
                $rootScope.currentCustomerUserName = data.username;
                $rootScope.currentCustomerAuthToken = data.auth_token;
                data.password = $scope.loginData.password;
                data.password_confirmation = $scope.loginData.password;
                authFactory.setCustomer(data);
                $rootScope.fullName = authFactory.getCustomer().full_name;
                deliveryLoader.hideLoading();
                var alertPopup = $ionicPopup.alert({
                    title: $translate.instant('LOGIN'),
                    template: $translate.instant('LOGIN_SUCCESS_MSG'),
                });
                alertPopup.then(function (res) {
                    $scope.closeLogin();
                });
            } catch (e) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(401, 'LOGIN'));
            }
        }).error(function (err, statusCode) {
            $rootScope.isAuthenticated = false;
            authFactory.deleteCustomer();

            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(statusCode, 'LOGIN'));
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
        });
    };

    /// <summary>loginFromCart: Perform the login action when the user checkout and he is not logged in</summary>
    $scope.loginFromCart = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));

        customerFactory.login($scope.loginData).success(function (data) {
            $rootScope.isAuthenticated = true;
            $rootScope.isUserLoggedin = true;
            $rootScope.currentCustomerId = data.id;
            $rootScope.currentCustomerUserName = data.username;
            $rootScope.currentCustomerAuthToken = data.auth_token;
            data.password = $scope.loginData.password;
            data.password_confirmation = $scope.loginData.password;
            authFactory.setCustomer(data);
            deliveryLoader.hideLoading();
            // if login successed, go to 'cart-addresses' view to continue order checkout
            $state.go('app.cart-addresses');
        }).error(function (err, statusCode) {
            $rootScope.isAuthenticated = false;
            authFactory.deleteCustomer();

            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(statusCode, 'LOGIN'));
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
        });
    }

    /// <summary>prevStep: Redirect the user back to 'select categories' modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $scope.closeLogin();
    }

});