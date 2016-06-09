angular.module('delivery.controllers', [])

.controller('LanguageSwitchController',
  function ($scope, $rootScope, $translate, $ionicPlatform, $window, storageUtilityFactory) {
    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
        storageUtilityFactory.setSelectedLanguage(langKey);
    };

    $scope.refreshState = function () {
        $window.location.reload();
    };

    $rootScope.$on('$translateChangeSuccess', function(event, data) {
      var language = data.language;

      $rootScope.lang = language;

      $rootScope.default_direction = language === 'ar' ? 'rtl' : 'ltr';
      $rootScope.opposite_direction = language === 'ar' ? 'ltr' : 'rtl';

      $rootScope.default_float = language === 'ar' ? 'right' : 'left';
      $rootScope.opposite_float = language === 'ar' ? 'left' : 'right';
      
    });

    // get the user prefered language from 'localStorage' and set the application language
    $ionicPlatform.ready(function () {
        $scope.changeLanguage(storageUtilityFactory.getSelectedLanguage());
    });
})

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $translate, $ionicPlatform, $ionicPopup, $ionicPopup, $cordovaNetwork, $cordovaSplashscreen, authFactory, connectionFactory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // showMainView: control the visibility of the main app screen, initial value = false, true when an address has been choosen
    $rootScope.showMainView = false;
    $rootScope.isCategorySelected = false;
    $rootScope.showMenuButton = true;
    $rootScope.showBackButton = false;

    //Define application-wide variables here
    $rootScope.isUserLoggedin = false;
    $rootScope.userName = '';

    $rootScope.showCartFabButton = false;
    $rootScope.cartItems = [];
    $rootScope.cartShop = null;
    $rootScope.cartAddress = null;
    $rootScope.cartNote = { text: "" };

    //Get saved pereferences from localStorage
    if (authFactory.isLoggedIn()) {
        $rootScope.isUserLoggedin = true;
        $rootScope.userName = authFactory.getCustomer().username;
    }

    ///////////////////////////////////////////////////////
    //////  Create the side menu functions and modals /////
    ///////////////////////////////////////////////////////

    /// <summary>showLogin: Show the login modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showLogin = function () {
        // Create the login modal
        $ionicModal.fromTemplateUrl('templates/side-menu/login.html', {
            id: '1',
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.loginModal = modal;
            $rootScope.loginModal.show();
        });
    };

    /// <summary>logout: Logout cuurent user when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $scope.logout = function () {
        // Show a confirmation popup
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('LOGOUT'),
            template:  $translate.instant('LOGOUT_MSG'),
            cancelText: $translate.instant('NO'),
            okText: $translate.instant('YES')
        });

        // Resolve the promise returned by the popup, then logout the user if user confirm
        confirmPopup.then(function (res) {
            if (res) {
                authFactory.deleteCustomer();
                $rootScope.isUserLoggedin = false;
                $rootScope.userName = '';
                $rootScope.categoriesModal.show();
                $rootScope.loadCategories();
            }
        });
    };

    /// <summary>showRegister: Show the register modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showRegister = function () {
        // Create the register modal
        $ionicModal.fromTemplateUrl('templates/side-menu/register.html', {
            id: '2',
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.registerModal = modal;
            $rootScope.registerModal.show();
        });
    };
    
    /// <summary>showProfile: Show the profile modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showProfile = function () {
        // Create the profile modal
        $ionicModal.fromTemplateUrl('templates/side-menu/profile.html', {
            id: '3',
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.profileModal = modal;
            $rootScope.customerProfile = authFactory.getCustomer();
            $rootScope.profileModal.show();
        });
    }

    /// <summary>showAddresses: Show the addresses modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showAddresses = function () {
        // Create the addresses modal
        $ionicModal.fromTemplateUrl('templates/side-menu/addresses.html', {
            id: '4',
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.addressesModal = modal;
            $rootScope.addressesModal.show();
        });
    }

    
    /// <summary>showContactUs: Show the contact us modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showContactUs = function () {
        // Create the contact us modal
        $ionicModal.fromTemplateUrl('templates/side-menu/contact-us.html', {
            id: '5',
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.contactUsModal = modal;
            $rootScope.contactUsModal.show();
        });
    }
    
    /// <summary>showHelp: Show the help modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showHelp = function () {
        // Create the help modal
        $ionicModal.fromTemplateUrl('templates/side-menu/help.html', {
            id: '6',
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.helpModal = modal;
            $rootScope.helpModal.show();
        });
    }

    /// <summary>showAbout: Show the about modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showAbout = function () {
        // Create the about modal
        $ionicModal.fromTemplateUrl('templates/side-menu/about.html', {
            id: '7',
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.aboutModal = modal;
            $rootScope.aboutModal.show();
        });
    }

    /// <summary>exitApp: exit the application when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.exitApp = function () {
        ionic.Platform.exitApp();
        //$ionicPlatform.exitApp();
    }
    ///////////////////////////////////////////////////////
    ////////  End of side menu functions and modals ///////
    ///////////////////////////////////////////////////////


    // Create the categories modal which should be the starting point in the app
    $ionicModal.fromTemplateUrl('templates/categories.html', {
        scope: $rootScope,
        hardwareBackButtonClose: false,
    }).then(function (modal) {
        $rootScope.categoriesModal = modal;
    });

    //Show the categories modal when app is ready
    $ionicPlatform.ready(function () {
        connectionFactory.testConnection().success(function (data) {
            $rootScope.categoriesModal.show();
            $cordovaSplashscreen.hide();
        }).error(function (err, statusCode) {
            $cordovaSplashscreen.hide();

            // Create the no connection modal which should be displayed when no internet connection
            $ionicModal.fromTemplateUrl('templates/no-connection.html', {
                scope: $rootScope,
                hardwareBackButtonClose: false,
            }).then(function (modal) {
                $rootScope.noConnectionModal = modal;
                $rootScope.noConnectionModal.show();
            });

            $cordovaSplashscreen.hide();
            //connectionFactory.exitApplication();
        })
        
    });
})
