var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
    	redirectTo: '/login'
    }).
	when('/login',{
		templateUrl : "login.html",
		controller: "LoginCtrl"
	});
});