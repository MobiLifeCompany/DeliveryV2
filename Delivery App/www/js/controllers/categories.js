angular.module('delivery.controllers')

.controller('CategoriesCtrl', function ($scope, $rootScope, $ionicLoading, $translate, $ionicModal, $timeout, $http, $ionicPlatform, $ionicPopup, connectionFactory, authFactory, storageUtilityFactory, businessCategoriesFactory, deliveryLoader) {

    $scope.categories = [];
    $scope.done_loading = true;

    if (!angular.isUndefined(storageUtilityFactory.getSelectedLanguage()) && storageUtilityFactory.getSelectedLanguage() !== null) {
        $rootScope.lang = storageUtilityFactory.getSelectedLanguage();
    } else {
        $rootScope.lang = 'en';
        storageUtilityFactory.setSelectedLanguage($rootScope.lang);
    }

    $rootScope.loadCategories = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));
        businessCategoriesFactory.get().success(function (data) {
            $scope.categories = data;
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.showAlertPopup($translate.instant('ERROR'), $translate.instant('COMMON_ERROR_MSG'));
        })
    }


    /// <summary>setCategory: Add the selected category to $rootScope and redirect user to next page based on saved pereferences</summary>
    /// <param name="i" type="integer">The id of the selected category</param>
    $rootScope.setCategory = function (category) {

        $rootScope.selectedCategory = category;
        storageUtilityFactory.setSelectedCategory(category);

        //If the user has been logged in before redirect him\her to 'saved areas' modal
        if (authFactory.isLoggedIn()) {
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

    $scope.showMainScreen = function () {
        $rootScope.showMainView = true;
        $timeout(function () {
            $rootScope.categoriesModal.hide();
        }, 500);
    };
    
    /////////////////////// functions calls on load//////////////////////
    connectionFactory.testConnection().success(function (data) {
        $rootScope.loadCategories();
    }).error(function (err, statusCode) {
        connectionFactory.exitApplication();
    })

});