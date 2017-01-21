/* global angular */

angular.module('whelmed')
.factory('UserSvc',
  function ($rootScope, $http, $q, ActSvc) {
    var userSvc = {};

    // Log user out and clear their information.
    userSvc.getInfo = function(token) {
      var result = $q.defer();
      gapi.client.localUser.get().execute(function(res) {
        if (res != null) {
          $rootScope.user = res.result;
          $rootScope.$broadcast('myService:getUserConfigSuccess');
          $rootScope.userLoggedIn = true;
          $rootScope.activities = [];
          userSvc.getActs($rootScope.user.Username + "_all").then(function(resp) {
            for(var i = 0; i < resp.length; i++) {
              ActSvc.getActivity(resp[i]).then(function(activity) {
                $rootScope.activities.push(activity.result);
              });
            };
          });
          result.resolve(res);
        };
      });
      return result.promise;
    };

    userSvc.editInfo = function(info) {
      var result= $q.defer();
      gapi.client.localUser.edit({
        'FirstName': info.FirstName,
        'LastName': info.LastName,
        'Profile': info.Profile,
        'Zip': info.Zip,
        'Picture': info.Picture
      }).execute(function(res) {
        if (res != null) {
          userSvc.getInfo().then(function() {
            result.resolve(res);
          });
        };
      });
      return result.promise;
    };

    userSvc.login = function(credentials) {
      var result = $q.defer();
      gapi.client.localLogin.login({
        'Username': credentials.username,
        'Password': credentials.password
      }).execute(function(res) {
        if (res.message === "OK") {
          userSvc.getInfo().then(function(user) {
            if (user.Username === credentials.username) {
              result.resolve("User Logged In");
            }
            else {
              result.reject();
            }
          });
        }
        else {
          result.reject("User does not exist.");
        };
      });
      return result.promise;
    };

    userSvc.getActs = function(listName) {
      var result= $q.defer();
      gapi.client.activityList.get({
        'ListName': listName
      }).execute(function(resp) {
        if (resp.listName === listName) {
          result.resolve(resp.listActivities);
        }
        else {
          result.reject();
        }
      });
      return result.promise;
    };

    return userSvc;
  }
);
