angular.module('whelmed')
.controller('registryCtrl',
  function ($scope, $stateParams, $rootScope, $state, toastSvc, ActSvc) {
    $scope.activity = {};
    $scope.activity.Name = $stateParams.actName;
    $scope.loaded = false;
    $scope.editMode = false;

    $scope.types = [
      { name: "Sport", icon: 'directions_run'},
      { name: "Outdoor", icon: 'nature_people'},
      { name: "Eat", icon: 'local_dining'},
      { name: "Play", icon: 'videogame_asset'},
      { name: "Tourist", icon: 'local_see'},
      { name: "Anything", icon: 'all_inclusive'}
    ];

    $scope.navigate = function navigate(state) {
      $state.go(state);
    };

    $scope.toggleEdit = function toggleEdit() {
      $state.go(editAct);
    };

    $scope.submitEdit = function submitEdit() {
      $scope.editMode = false;
    };

    $scope.getActivity = function getActivity(actName) {
      ActSvc.getActivity(actName).then(function(activity) {
        $scope.activity = activity.result;
        for (var i = 0; i < $scope.types.length; i++) {
          if ($scope.activity.Type === $scope.types[i].name) {
            $scope.activity.Type = $scope.types[i];
          }
        }
        $scope.loaded = true;
      });
    };

    $scope.$on('myService:activityLoaded', function() {
      $scope.getActivity($stateParams.actName);
    });

    if ($rootScope.user != null) {
      $scope.getActivity($stateParams.actName);
    };
});
