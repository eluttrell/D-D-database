const app = angular.module('rpg', ['ui.router', 'ngCookies']);


// ========================
// SERVICE
// ========================

app.factory('$RpgFactory', function($http, $state, $cookies) {
    let service = {};

    service.signupPage = function(data) {
      let url = '/signup';
        return $http({
          method: 'POST',
          data: data,
          url: url
        });
    };

    service.showLogin = function(data) {
        let url = '/login';
        return $http({
                method: 'POST',
                data: data,
                url: url
            })
            .then(function(loggedIn) {
                // Put information to be stored as cookies here:
                $cookies.putObject('username', loggedIn.data.info.user_id);
                $cookies.putObject('token', loggedIn.data.info.token);
                $cookies.putObject('expiry', loggedIn.data.info.timestamp);
                console.log("Info:", loggedIn.data.info);
            });
    };

    return service;
});


// ========================
// CONTROLLERS
// ========================

app.controller('SignupController', function($scope, $state, TwitterFactory) {
    $scope.signUp = function() {
        let data = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password
        };
        TwitterFactory.showSignup(data)
            .then(function(results) {
                console.log('showSignup step 1');
                return results;
            })
            .then(function() {
                return TwitterFactory.showLogin(data);
            })
            .then(function() {
                $state.go('home');
            })
            .catch(function(err) {
                console.log("Failed:", err.stack);
            });
    };
});


// ========================
// STATES
// ========================

app.config(($stateProvider, $urlRouteProvider) => {
    $stateProvider
      .state({
        name: 'home',
        url: '/',
        templateUrl: '/templates/home.html'
      })
      .state({
        name: 'signup',
        url: '/signup',
        templateUrl: '/templates/signup.html',
        controller: 'SignupController'
      })

    $urlRouteProvider.otherwise('/');
});
