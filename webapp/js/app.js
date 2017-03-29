var app = angular.module("myApp", ["ngRoute","angularFileUpload","ngCookies"]);


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


//sprav get na get_logged_user, server vrati 200 ak ma user session cize je prihlaseny vtedy tato factory vrati true
//ak server vrati 401 user nema session a nie je prihlaseny, factory vrati false
app.factory('isLogged',function($http){
    return {
        isLo:function(){
            var req = {
                method:'GET',
                url: 'get_logged_user'
            }

            var promise = $http(req).then(function(){
                return true;
            },function(){
                return false;
            })

            return promise;
        }
    }
})