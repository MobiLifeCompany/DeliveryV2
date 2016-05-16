// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'driver' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'delivery.controllers' is found in controllers.js
angular.module('delivery', ['ionic', 'delivery.controllers', 'delivery.factory', 'pascalprecht.translate', 'ionic-material', 'jett.ionic.filter.bar', 'ngCordova'])

.run(function ($ionicPlatform) {
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
  });
})

.run(['$rootScope', function ($rootScope) {
    if (localStorage.getItem("language"))
        $rootScope.lang = localStorage.getItem("language");
    else
        $rootScope.lang = 'en';

    $rootScope.default_float = 'left';
    $rootScope.opposite_float = 'right';

    $rootScope.default_direction = 'ltr';
    $rootScope.opposite_direction = 'rtl';
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
