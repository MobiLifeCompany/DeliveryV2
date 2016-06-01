angular.module('delivery.controllers')

.controller('ProfileCtrl', function ($scope, $rootScope, $state, $ionicLoading, $timeout, $translate, customerFactory, authFactory, deliveryLoader) {

    $scope.customer = authFactory.getCustomer();
    $scope.customer.phone = Number($scope.customer.phone);
    /// <summary>closeRegister: Close the register modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.profileModal.hide();
    };

    $scope.updateProfile = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));
        customerFactory.updateProfile($scope.customer).success(function (data) {
            $rootScope.currentCustomerId = data.id;
            $rootScope.currentCustomerUserName = data.username;
            $rootScope.currentCustomerAuthToken = data.auth_token;
            data.password = $scope.customer.password;
            data.password_confirmation = $scope.customer.password;
            authFactory.deleteCustomer();
            authFactory.setCustomer(data);
            deliveryLoader.hideLoading();
            //$state.go('app.shops');

        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(statusCode, 'PROFILE'));
        });
    }
});