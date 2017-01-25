/* global angular */

angular.module('whelmed')
.factory('toastSvc',
    [
        '$mdToast',
        function($mdToast) {
            "use strict";

            var svc = this;

            svc.DURATION_LONG = 3000;
            svc.DURATION_SHORT = 1000;

            /**
             * Creates a preconfigured toast using $mdToast.
             *
             * @param  {string} message the message to display in the toast
             * @param  {object} options should have two members, one for customizing
             *                          the position of the toast called position and
             *                          one for customizing the hide delay called
             *                          duration. This is optional, when not present, toasts
             *                          will default to the top right and will show for
             *                          3 seconds.
             * @return {promise}         returns the promise from $mdToast.show().
             */

            svc.show = function(message, options) {
                var position, duration;

                if (typeof options === 'undefined') {
                    position = 'top right';
                    duration = svc.DURATION_LONG;
                }
                else {
                    position = options.position || 'top right';
                    duration = options.duration || svc.DURATION_LONG;
                }

                return $mdToast.show(
                    $mdToast.simple()
                    .content(message)
                    .position(position)
                    .hideDelay(duration)
                    .action('OK')
                );
            };

            return svc;
        }
    ]
);
