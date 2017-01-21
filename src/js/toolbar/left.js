angular.module('whelmed')
.controller('LeftCtrl',
  function ($scope, $timeout, $mdSidenav, AuthSvc, $state, toastSvc, $rootScope) {

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close();
    };

    $scope.navigate = function navigate(state) {
      $scope.close();
      $state.go(state);
    };

    $scope.navOptions = [
      { 'name': 'RSVP', 'action': 'addAct' },
      { 'name': 'Registry', 'action': 'showAct' },
      { 'name': 'Bridal Shower', 'action': 'profile' }
    ];

    $scope.logout = function logout(){
      AuthSvc.clearUser();
      toastSvc.show('User successfully logged out');
      $scope.close();
      $scope.navigate('home');
    };

    // $rootScope.userLoggedIn = true;
  }
);
