angular.module('delivery.controllers')

.controller('AreasCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $ionicFilterBar, $ionicSlideBoxDelegate) {
    $ionicLoading.show();
    // wait for 1 seconds and hide the overlay
    $timeout(function () {
        $ionicLoading.hide();
        $scope.done_loading = true;
    }, 1000);

    //dummy data for areas
    $scope.areas = [
        { name: 'Sahat Al-Assi', id: 1 },
        { name: 'Alshareaa', id: 2 },
        { name: 'Aldabagha', id: 3 },
        { name: 'Almarabet', id: 4 },
        { name: 'Janob Al-Malaab', id: 5 },
        { name: 'Aldahia', id: 6 },
        { name: 'Tarek Halab', id: 7 }
    ];

    $rootScope.selectedArea = {};

    /// <summary>setArea: add the selected area to '$rootScope' and 'localStorage' then redirect the user to main view</summary>
    /// <param name="i" type="integer">The id of the selected area</param>
    $scope.setArea = function (i) {
        $rootScope.selectedArea = { id: i, name: $scope.areas[i - 1].name };
        localStorage.setItem("areaID", i);
        localStorage.setItem("areaName", $scope.areas[i - 1].name);

        // Hide the modal and show the main view
        $rootScope.areasModal.hide();
        $rootScope.showMainView = true;
        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
    };

    /// <summary>prevStep: redirect the user back to select cities modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $rootScope.areasModal.hide();
        $rootScope.citiesModal.show();
    };
});