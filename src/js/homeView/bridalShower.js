/* global angular */

angular.module('whelmed')
.controller('bridalShowerCtrl',
  [
    '$scope', '$state', '$rootScope', 'UserSvc',
    function($scope, $state, $rootScope, UserSvc) {
      "use strict";

      $scope.editUser;

      $scope.navigate = function navigate(home) {
        $state.go(home);
      };

      $scope.edit = function edit(type) {
        if (type === 'user') {
          $scope.editUser = true;
        }
      };

      $scope.editSubmit = function editSubmit(info) {
        if (typeof info.FirstName === "undefined") {
          info.FirstName = $rootScope.user.FirstName;
        }
        if (typeof info.LastName === "undefined") {
          info.LastName = $rootScope.user.LastName;
        }
        if (typeof info.Profile === "undefined") {
          info.Profile = $rootScope.user.Profile;
        }
        if (typeof info.Zip === "undefined") {
          info.Zip = $rootScope.user.Zip;
        }
        if (typeof info.Picture === "undefined") {
          info.Picture = $rootScope.user.Picture;
        }

        UserSvc.editInfo(info).then(function() {
          $scope.editUser = false;
        });
      };

      $scope.cancel = function cancel() {
        $scope.editUser = false;
      };

    }
  ]
);
