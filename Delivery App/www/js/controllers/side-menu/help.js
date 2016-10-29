angular.module('delivery.controllers')

.controller('HelpCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, storageUtilityFactory) {

    $scope.options = { showHelp: true };
    if (storageUtilityFactory.getShowHelp() !== null)
        $scope.options.showHelp = storageUtilityFactory.getShowHelp();
    /// <summary>close: Close the addresses modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        storageUtilityFactory.setShowHelp($scope.options.showHelp);
        $rootScope.helpModal.hide();
    };
});