angular.module('delivery.controllers')

.controller('ProfileCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $translate, customerFactory, authFactory, deliveryLoader) {

    $scope.customer = authFactory.getCustomer();
    /// <summary>closeRegister: Close the register modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.profileModal.hide();
    };

    $scope.updateProfile = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));
        customerFactory.updateProfile($scope.customer).success(function (data) {
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(statusCode, 'PROFILE'));
        });
    }
});