/* global angular */

angular.module('whelmed')
.directive('cardTmp',
    [
        function() {
            "use strict";

            return {
                restrict: 'E',
                scope: {
                    activity: '='
                },
                templateUrl: 'js/directives/actCard.tpl.html'
            };
        }
    ]
);
