'use strict';

angular.module('findieApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute'
])
.config([
	'$routeProvider', '$locationProvider', '$httpProvider',
function (
	$routeProvider, $locationProvider, $httpProvider
) {
	$routeProvider.when('/', {
		templateUrl: 'partials/main',
		controller: 'MainCtrl'
	})
	.when('/login', {
		templateUrl: 'partials/login',
		controller: 'LoginCtrl'
	})
	.when('/signup', {
		templateUrl: 'partials/signup',
		controller: 'SignupCtrl'
	})
	.when('/settings', {
		templateUrl: 'partials/settings',
		controller: 'SettingsCtrl',
		authenticate: true
	})
	.when('/settings/password', {
		templateUrl: 'partials/settings-password',
		controller: 'SettingsPasswordCtrl',
		authenticate: true
	})
	.when('/u/:username', {
		templateUrl: 'partials/findie-page',
		controller: 'FindiePageCtrl',
		resolve: {
			user: ['$route', 'users', function ($route, users) {
				var username = $route.current.params.username;

				return users.get(username);
			}]
		}
	})
	.otherwise({
		redirectTo: '/'
	});
		
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

	// Redirect to login if route requires auth and you're not logged in
	$rootScope.$on('$routeChangeStart', function (event, next) {
		
		if (next.authenticate && !User.isLoggedIn()) {
			$location.path('/login');
		}
	});
}])
.run(['$rootScope', 'alerts', function ($rootScope, alerts) {
	$rootScope.alerts = alerts;
}]);