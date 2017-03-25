var app = angular.module("myApp", ["ngRoute"]);


//vzdy chod na login route lebo jej controler overi ci je clovek prihlaseny, ak je posle ho na main ak nie ostane na logine
//ak niekto hitne route main tak main controller overi ci je clovek prihlaseny, ak nie je redirectne ho na login
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
    	redirectTo: '/login'
    }).
	when('/login',{
		templateUrl : "login.html",
		controller: "LoginCtrl"
	}).
	when("/main", {
        templateUrl : "main.html",
        controller: "MainCtrl"
    }).
    otherwise({redirectTo:'/login'});
});