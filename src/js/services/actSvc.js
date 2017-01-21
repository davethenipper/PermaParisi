/* global angular */

angular.module('whelmed')
.factory('ActSvc',
  function ($rootScope, $http, $q) {
    var actSvc = {};

    // Log user out and clear their information.
    actSvc.getActivity = function(name) {
      var result = $q.defer();
      gapi.client.activity
      .get({'Activity': name})
      .execute(function(res) {
        result.resolve(res);
      });
      return result.promise;
    };

    return actSvc;
  }
);
