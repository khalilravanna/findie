'use strict';

var angularRoutes = require('./angular-routes');

angular.module('findieApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'flow'
])
.config([
	'$routeProvider', '$locationProvider', '$httpProvider',
function (
	$routeProvider, $locationProvider, $httpProvider
) {
	// Run the $routeProvider routes block here
	angularRoutes($routeProvider);
		
	$locationProvider.html5Mode(true);
		
	// Intercept 401s and redirect you to login
	$httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
		return {
			responseError: function (response) {
				if (response.status === 401) {
					$location.path('/login');
					return $q.reject(response);
				}
				else {
					return $q.reject(response);
				}
			}
		};
	}]);
}])
.run(['$rootScope', '$location', 'User', function ($rootScope, $location, User) {
	$rootScope.$on('$routeChangeStart', function (event, next) {
		
		// Redirect to login if route requires auth and you're not logged in
		if (next.authenticate && !User.isLoggedIn()) {
			$location.path('/signup').search('redirect', next.$$route.originalPath);
		}

		// Redirect to route if they hit /login /signup and are already logged in
		if (next.handleLoggedInUser && User.isLoggedIn()) {
			var redirect = $location.search().redirect;
			// Clear out redirect from query params as we are already redirecting
			if (redirect) {
				$location.search('redirect', null);
			}
			// Default to home if no redirect specified
			redirect = redirect || '/home';
			$location.path(redirect);
		}
	});
}])
.run(['$rootScope', 'alerts', function ($rootScope, alerts) {
	$rootScope.alerts = alerts;
}]);