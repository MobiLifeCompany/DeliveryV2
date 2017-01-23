angular.module('delivery.controllers')

.controller('HelpCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, storageUtilityFactory) {

    
    $scope.showLaunchSoon = function () {
        var d = new Date();
        if (d.getFullYear() == '2017' && d.getMonth() <= '1' && $rootScope.versionCountry == 'sy')
            return true;
        else
            return false;
    }
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