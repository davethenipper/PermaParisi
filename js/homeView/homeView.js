/* global angular */

angular.module('whelmed')
.controller('HomeViewCtrl',
  [
    '$scope', '$state', '$stateParams',
    function($scope, $state, $stateParams, toastSvc) {
      "use strict";

      $scope.displayOverflow = false;

      // Navigate to different display
      $scope.navigate = function navigate(state) {
        $state.go(state);
      };

      // Action Settings
      this.actionCtrl = {
        isOpen: false,
        selectedMode: 'md-fling',
        selectedDirection: 'up',
      }

      // actions
      this.actions = [
        { name: "Sport", icon: 'directions_run'},
        { name: "Outdoor", icon: 'nature_people'},
        { name: "Eat", icon: 'local_dining'},
        { name: "Play", icon: 'videogame_asset'},
        { name: "Tourist", icon: 'local_see'},
        { name: "Anything", icon: 'all_inclusive'}
      ];

      $scope.cards = [
        {
          title: 'Amazon Registry',
          link: 'smile.amazon.com',
          description: 'An online registry for ease and simplicity',
          img: 'https://dl.dropboxusercontent.com/s/gem8ve82q7l53gn/Amazon-Wedding-Registry.png?dl=0'
        },
        {
          title: 'Target Registry',
          link: "https://smile.amazon.com/",
          description: 'A registry for all you brick and mortar folk',
          img: 'https://dl.dropboxusercontent.com/s/six2v4dzidc0khx/Target.png?dl=0'
        },
        {
          title: 'Inn of Chagrin Falls',
          link: "https://smile.amazon.com/",
          description: 'A Hotel nearby for those from out of town',
          img: 'https://dl.dropboxusercontent.com/s/x0sapz5wh4eejmd/inn-logo.png?dl=0'
        }];

      $scope.toast = function toast(text) {
        // toastSvc.show('toast');
        toastSvc.show(text);
      }
    }
  ]
);
