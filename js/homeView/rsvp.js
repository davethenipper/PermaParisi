angular.module('whelmed')
.controller('rsvpCtrl',
  function ($scope, $rootScope, $state, toastSvc) {

    $scope.navigate = function navigate(state) {
      $state.go(state);
    };

    $scope.actForm;

    $scope.types = [
      { name: "Sport", icon: 'directions_run'},
      { name: "Outdoor", icon: 'nature_people'},
      { name: "Eat", icon: 'local_dining'},
      { name: "Play", icon: 'videogame_asset'},
      { name: "Tourist", icon: 'local_see'},
      { name: "Anything", icon: 'all_inclusive'}
    ];

    $scope.checkErrors = function checkErrors() {
      var errors = false;
      $scope.errorMessage = [];
      if (typeof $scope.activity.name === 'undefined') {
        $scope.errorMessage.push("Activity Name not given.");
      }
      if (typeof $scope.activity.latitude === 'undefined' ||
          typeof $scope.activity.longitude === 'undefined') {
        $scope.errorMessage.push("Location not given. Please input latitude and longitude");
      }
      if (typeof $scope.activity.summary === 'undefined') {
        $scope.errorMessage.push("Please give a short summary of the activity");
      }
      if (typeof $scope.activity.type === 'undefined') {
        $scope.errorMessage.push("Must select type of activity");
      }
      if (typeof $scope.activity.maxtime === 'undefined') {
        $scope.errorMessage.push("Must give a time estimate for activity");
      }
      if ($scope.errorMessage.length < 1) {
        $scope.submit();
        $scope.errorMessage = [];
      }
    };

    $scope.submit = function submit() {
      gapi.client.activity.add({
        'Activity': $scope.activity.name,
        'Description': $scope.activity.description || null,
        'Summary': $scope.activity.summary || null,
        'Type': $scope.activity.type,
        'TimeToComplete': $scope.activity.maxtime,
        'Image': $scope.activity.imgUrl || null,
        'Latitude': $scope.activity.latitude,
        'Longitude': $scope.activity.longitude
      }).execute(function(resp) {
        if(typeof resp.code === 'undefined'){
          toastSvc.show('Successfully added activity');
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
          $state.go('showAct', {actName: $scope.activity.name});
        }
        else {
          console.log(resp);
          toastSvc.show('Was unable to add activity.  Check errors');
        }
      });
    };
  }
);
