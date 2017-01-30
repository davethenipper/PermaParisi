/* global angular */

angular.module('whelmed')
.directive('optCard',
    [
        function() {
            "use strict";

            return {
                restrict: 'E',
                scope: {
                    activity: '='
                },
                templateUrl: 'js/directives/optCard.tpl.html'
            };
        }
    ]
);
