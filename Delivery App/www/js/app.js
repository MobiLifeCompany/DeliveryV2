// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'driver' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'delivery.controllers' is found in controllers.js
angular.module('delivery', ['ionic', 'delivery.controllers', 'delivery.factory', 'pascalprecht.translate', 'ionic-material', 'jett.ionic.filter.bar', 'ngCordova', 'ui.router'])

.run(function ($ionicPlatform, $rootScope, $ionicPopup, storageUtilityFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    cordova.plugins.notification.local.on("click", function () {
        if ($rootScope.notification.additionalData["type"] === 'ORDER_NOTIFICATION') {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.notification.title,
                template: $rootScope.notification.message
            });
        }
    });

    var push = PushNotification.init({
        "android": {
            "senderID": "180733002242"
        },
        "ios": {
            "alert": "true",
            "badge": "true",
            "sound": "true"
        },
        "windows": {}
    });

    push.on('registration', function (data) {
        console.log("registration event");
        $rootScope.registrationId = data.registrationId;
        storageUtilityFactory.setGcmId(data.registrationId);

    });

    push.on('registered', function (data) {
        console.log("registration event");
        $rootScope.registrationId = data.registrationId;
        storageUtilityFactory.setGcmId(data.registrationId);

    });

    push.on('notification', function (data) {
        if (cordova.platformId === 'android') {
            $rootScope.notification = data;
            console.log("notification event");
            cordova.plugins.notification.local.add({
                id: data.additionalData["google.message_id"].substring(2, 15),
                message: data.message,
                title: data.title,
                sound: "file://sound/delivery-tone.mp3",
                icon: "http://admin.deliveryonweb.com/dist/img/logo.png",
                data: { type: "ORDER" },
            }).then(function () {
                console.log("The notification has been set");
            });
        }
    });

    push.on('error', function (e) {
        console.log("push error");
    });

  });
})
.run(['$rootScope','storageUtilityFactory', function ($rootScope, storageUtilityFactory) {
    if (!angular.isUndefined(storageUtilityFactory.getSelectedLanguage()) && storageUtilityFactory.getSelectedLanguage() !== null) {
        $rootScope.lang = storageUtilityFactory.getSelectedLanguage();
    }else {
        $rootScope.lang = 'en';
        storageUtilityFactory.setSelectedLanguage($rootScope.lang);
    }

    $rootScope.default_direction = $rootScope.lang === 'ar' ? 'rtl' : 'ltr';
    $rootScope.opposite_direction = $rootScope.lang === 'ar' ? 'ltr' : 'rtl';

    $rootScope.default_float = $rootScope.lang === 'ar' ? 'right' : 'left';
    $rootScope.opposite_float = $rootScope.lang === 'ar' ? 'left' : 'right';

    // for Syria the coutnry id = 1
    $rootScope.countryId = 1;
    if ($rootScope.lang == 'en')
        $rootScope.currency = 'SYP';
    else
        $rootScope.currency = 'ل.س.';

    storageUtilityFactory.setCountry($rootScope.countryId);
}])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
      })

    .state('app.shops', {
        url: '/shops',
        views: {
            'order': {
                templateUrl: 'templates/shops.html',
                controller: 'ShopsCtrl'
            }
        }
    })

    .state('app.shop-details', {
        url: '/shop-details/:shopId',
        views: {
            'order': {
                templateUrl: 'templates/shop-details.html',
                controller: 'ShopDetailsCtrl'
            }
        }
    })

    .state('app.cart', {
        url: '/cart',
        views: {
            'order': {
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
            }
        }
    })

    .state('app.cart-login', {
        url: '/cart-login',
        views: {
            'order': {
                templateUrl: 'templates/cart-login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.cart-addresses', {
        url: '/cart-addresses',
        views: {
            'order': {
                templateUrl: 'templates/cart-addresses.html',
                controller: 'AddressesCtrl'
            }
        }
    })

    .state('app.checkout', {
        url: '/checkout',
        views: {
            'order': {
                templateUrl: 'templates/checkout.html',
                controller: 'CheckoutCtrl'
            }
        }
    })

    .state('app.order-confirmation', {
        url: '/order-confirmation',
        views: {
            'order': {
                templateUrl: 'templates/order-confirmation.html',
                controller: 'orderConfirmationCtrl'
            }
        }
    })

    .state('app.old-orders', {
        url: '/old-orders',
        views: {
            'old-orders': {
                templateUrl: 'templates/old-orders.html',
                controller: 'OldOrdersCtrl'
            }
        }
    })

    .state('app.silver-offers', {
        url: '/silver-offers',
        views: {
            'silver-offers': {
                templateUrl: 'templates/silver-offers.html',
                controller: 'SilverOffersCtrl'
            }
        }
    });

  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/shops');
})

.config(['$translateProvider', '$ionicConfigProvider', function ($translateProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('top'); //bottom
    
    $translateProvider
    .useStaticFilesLoader({
        prefix: 'locales/lang-',
        suffix: '.json'
    })
    .preferredLanguage('en');

}]);
