angular.module('delivery.controllers')

.controller('CategoriesCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicPlatform, $ionicPopup) {
    //Dummy data for categories
    $scope.categories = [
        { title: 'Category ONE', id: 1 , src: "img/categories/icon1.jpg"},
        { title: 'Category TWO', id: 2, src: "img/categories/icon2.jpg" },
        { title: 'Category THREE', id: 3, src: "img/categories/icon3.jpg" },
        { title: 'Category FOUR', id: 4, src: "img/categories/icon4.jpg" },
        { title: 'Category FIVE', id: 5, src: "img/categories/icon5.jpg" },
        { title: 'Category SIX', id: 6, src: "img/categories/icon6.jpg" }
    ];

    /// <summary>setCategory: Add the selected category to $rootScope and redirect user to next page based on saved pereferences</summary>
    /// <param name="i" type="integer">The id of the selected category</param>
    $rootScope.setCategory = function (i) {
        
        $rootScope.selectedCategory = { id: i, name: $scope.categories[i - 1].name }

        //If the user has been logged in before redirect him\her to 'saved areas' modal
        if ($rootScope.isUserLoggedin) {
            $ionicModal.fromTemplateUrl('templates/saved-areas.html', {
                scope: $rootScope,
                hardwareBackButtonClose: false,
            }).then(function (modal) {
                $rootScope.savedAreasModal = modal;
                $rootScope.savedAreasModal.show();
            });
        }
        //Else if the user is not logged in redirect him\her to 'select cities' modal
        else {
            $ionicModal.fromTemplateUrl('templates/cities.html', {
                scope: $rootScope,
                hardwareBackButtonClose: false,
            }).then(function (modal) {
                $rootScope.citiesModal = modal;
                $rootScope.citiesModal.show();
            });
        }

        // wait for 1 seconds and hide this modal, for a smoother transition and reduce flekering
        $timeout(function () {
            $rootScope.categoriesModal.hide();
        }, 500);
    };
});