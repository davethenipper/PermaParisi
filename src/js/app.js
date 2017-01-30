/* global angular */

/*
    This sets up the main app module and also tells Angular
    what this module depends on to work correctly.
 */
angular.module('whelmed', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'angular-google-gapi',
    'ngCookies'
  ]
)
.config([
  '$urlRouterProvider', '$stateProvider', '$httpProvider', '$mdThemingProvider',
  function($urlRouterProvider, $stateProvider, $httpProvider, $mdThemingProvider) {
    "use strict";

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'js/homeView/homeView.tpl.html',
        controller: 'HomeViewCtrl as home'
      })
      .state('bridalShower', {
        url: '/bridalShower',
        templateUrl: 'js/homeView/bridalShower.tpl.html',
        controller: 'bridalShowerCtrl'
      })
      .state('registry', {
        url: '/registry',
        templateUrl: 'js/homeView/registry.tpl.html',
        controller: 'registryCtrl'
      })
      .state('rsvp', {
        url: '/rsvp',
        templateUrl: 'js/homeView/rsvp.tpl.html',
        controller: 'rsvpCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'js/account/profile.tpl.html',
        controller: 'ProfileCtrl'
      })
      .state('addAct', {
        url: '/addAct',
        templateUrl: 'js/activity/addAct.tpl.html',
        controller: 'AddActCtrl'
      })
      .state('showAct', {
        url: '/activity/{actName}',
        templateUrl: 'js/activity/showAct.tpl.html',
        controller: 'ShowActCtrl'
      })
      .state('editAct', {
        url: '/activity/{actName}/edit',
        templateUrl: 'js/activity/editAct.tpl.html',
        controller: 'EditActCtrl'
      })
      .state('listHome', {
        url: '/listHome',
        templateUrl: 'js/list/listHome.tpl.html',
        controller: 'ListCtrl'
      });

    $urlRouterProvider.otherwise('/');
    // // Initialize get if not there
    // if (!$httpProvider.defaults.headers.get) {
    //     $httpProvider.defaults.headers.get = {};
    // }
    //
    // // Disable IE ajax request caching
    // $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    // $httpProvider.defaults.headers.get.Pragma = 'no-cache';

    $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('teal', {
      'default': '500'
    })
  }
]);

// Runs initialization during load to load backend apis
function init() {
  window.initGapi();
};

// Controller is being used for initialization of APIs
angular.module('whelmed')
.controller('InitAPIController',
  function($scope, $window, $cookies, $rootScope, AuthSvc, UserSvc) {

    // Init command to load APIs
    $window.initGapi = function() {
      $scope.$apply($scope.load_lib);
    };

    // Load SignupUserApi
    $scope.load_lib = function() {
      $scope.is_backend_ready = false;
      $scope.load = 0;

      var user = $cookies.getObject('user') || {};
      $rootScope.user = {
        Username: user.username,
        Picture: user.picture,
        token: user.token
      };

      gapi.client.load('signup_user', 'v1', function() {
        $scope.load++;
      }, '/_ah/api');

      // Load AddActivityApi
      gapi.client.load('activity', 'v1', function() {
        $scope.load++;
        $rootScope.$broadcast('myService:activityLoaded');
      }, '/_ah/api');

      gapi.client.load('localUser', 'v1', function() {
        $scope.load++;
      }, '/_ah/api');

      gapi.client.load('localLogin', 'v1', function() {
        $scope.load++;
        var token = $rootScope.user.token || {};
        if (token.length > 0) {
          AuthSvc.validateToken(token)
          .then(function(resp) {
            AuthSvc.setCurrentUser(token);
          })
          .catch(function(resp) {
            console.log(resp);
            $cookies.remove('user');
          });
        }
        else {
          AuthSvc.clearUser(); // Otherwise clear user
        }
      }, '/_ah/api');

      gapi.client.load('activityList', 'v1', function() {
        $scope.load++;
        $rootScope.$broadcast('myService:getUserConfigSuccess');
      }, '/_ah/api');

      // while ($scope.load > 5) {
      //   $rootScope.is_backend_ready = true;
      //   $rootScope.$broadcast('myService:getUserConfigSuccess');
      // }
    };
});
