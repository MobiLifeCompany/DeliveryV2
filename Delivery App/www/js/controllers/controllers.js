angular.module('delivery.controllers', [])

.controller('LanguageSwitchController',
  function ($scope, $rootScope, $translate, $ionicPlatform) {
    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
        localStorage.setItem("language", langKey);
    };

    $rootScope.$on('$translateChangeSuccess', function(event, data) {
      var language = data.language;

      $rootScope.lang = language;

      $rootScope.default_direction = language === 'ar' ? 'rtl' : 'ltr';
      $rootScope.opposite_direction = language === 'ar' ? 'ltr' : 'rtl';

      $rootScope.default_float = language === 'ar' ? 'right' : 'left';
      $rootScope.opposite_float = language === 'ar' ? 'left' : 'right';
      
    });

    // get the user prefered language from 'localStoragre' and set the application language
    $ionicPlatform.ready(function () {
        $scope.changeLanguage(localStorage.getItem("language"));
    });
})

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $translate, $ionicPlatform, $ionicPopup, $cordovaToast, $cordovaNetwork) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // showMainView: control the visibility of the main app screen, initial value = false, true when an address has been choosen
    $rootScope.showMainView = false;

    //Define application-wide variables here
    $rootScope.isUserLoggedin = false;
    $rootScope.userName = '';
    $rootScope.showCartFabButton = false;
    $rootScope.cartItems = [];
    $rootScope.cartShop = null;

    //Get saved pereferences from localStorage
    if (localStorage.getItem("isUserLoggedin")) {
        $rootScope.isUserLoggedin = true;
        $rootScope.userName = localStorage.getItem("userName");
    }

    ///////////////////////////////////////////////////////
    //////  Create the side menu functions and modals /////
    ///////////////////////////////////////////////////////

    // Create the login modal
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.loginModal = modal;
    });
    /// <summary>showLogin: Show the login modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showLogin = function () {
        $rootScope.loginModal.show();
    };

    /// <summary>logout: Logout cuurent user when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $scope.logout = function () {
        // Show a confirmation popup
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Are you sure you want to logout?',
            cancelText: 'No',
            okText: 'Yes'
        });

        // Resolve the promise returned by the popup, then logout the user if user confirm
        confirmPopup.then(function (res) {
            if (res) {
                localStorage.removeItem("isUserLoggedin");
                localStorage.removeItem("userName");
                $rootScope.isUserLoggedin = false;
                $rootScope.userName = '';
            }
        });
    };

    // Create the register modal
    $ionicModal.fromTemplateUrl('templates/side-menu/register.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.registerModal = modal;
    });
    

    // Create the profile modal
    $ionicModal.fromTemplateUrl('templates/side-menu/profile.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.profileModal = modal;
    });
    /// <summary>showProfile: Show the profile modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showProfile = function () {
        $rootScope.profileModal.show();
    }

    // Create the addresses modal
    $ionicModal.fromTemplateUrl('templates/side-menu/addresses.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.addressesModal = modal;
    });
    /// <summary>showAddresses: Show the addresses modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showAddresses = function () {
        $rootScope.addressesModal.show();
    }

    // Create the contact us modal
    $ionicModal.fromTemplateUrl('templates/side-menu/contact-us.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.contactUsModal = modal;
    });
    /// <summary>showContactUs: Show the contact us modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showContactUs = function () {
        $rootScope.contactUsModal.show();
    }
    
    // Create the help modal
    $ionicModal.fromTemplateUrl('templates/side-menu/help.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.helpModal = modal;
    });
    /// <summary>showHelp: Show the help modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showHelp = function () {
        $rootScope.helpModal.show();
    }

    // Create the about modal
    $ionicModal.fromTemplateUrl('templates/side-menu/about.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.aboutModal = modal;
    });
    /// <summary>showAbout: Show the about modal when the corresponding sidemenu item is clicked</summary>
    /// <param>No parameters</param>
    $rootScope.showAbout = function () {
        $rootScope.aboutModal.show();
    }
    ///////////////////////////////////////////////////////
    ////////  End of side menu functions and modals ///////
    ///////////////////////////////////////////////////////


    // Create the categories modal which should be the starting point in the app
    $ionicModal.fromTemplateUrl('templates/categories.html', {
        scope: $rootScope,
        hardwareBackButtonClose: true,
    }).then(function (modal) {
        $rootScope.categoriesModal = modal;
    });

    //Show the categories modal when app is ready
    $ionicPlatform.ready(function () {
        
        $rootScope.categoriesModal.show();
        var isOffline = $cordovaNetwork.isOffline();
        if (isOffline) {
            $cordovaToast.show("Please check your internet connection", 'long', 'center');
        }
    });
})
