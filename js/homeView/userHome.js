/* global angular */

angular.module('whelmed')
.controller('UserHomeCtrl',
  [
    '$scope', '$rootScope', '$state', '$stateParams', 'toastSvc', 'UserSvc', 'ActSvc',
    function($scope, $rootScope, $state, $stateParams, toastSvc, UserSvc, ActSvc) {
      "use strict";

      $scope.displayOverflow = false;
      $scope.loaded = false;

      // Navigate to different display
      $scope.navigate = function navigate(state) {
        $state.go(state);
      };

      $scope.toast = function toast(text) {
        toastSvc.show(text);
      };

      $scope.action = {
        header: "Add Activity",
        click: "addAct",
        description: "Add a new activity to the database"
      };

      $scope.getActivities = function getActivities(user){
        $rootScope.activities = [];
        UserSvc.getActs(user + "_all").then(function(resp) {
          for(var i = 0; i < resp.length; i++) {
            ActSvc.getActivity(resp[i]).then(function(activity) {
              $rootScope.activities.push(activity.result);
            });
          };
        });
      };

      // $scope.$on('myService:getUserConfigSuccess', function() {
      //   if (typeof $rootScope.activities === "undefined" ||
      //       $rootScope.activities.length === 0) {
      //     $scope.getActivities($rootScope.user.Username);
      //   }
      // });

      // if(typeof $rootScope.activities === "undefined" &&
      //    typeof $rootScope.user != "undefined") {
      //   $scope.getActivities($rootScope.user.Username);
      //   $rootScope.load = false;
      // };
    }
  ]
);
