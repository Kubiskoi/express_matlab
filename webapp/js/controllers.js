app.controller('LoginCtrl', function($scope,$location,$http,isLogged) {
	$scope.wrong_cred = false;
	
	//ak user_logged je true presmeruj na main
	//ak user_logged je false ostan na login formulari
	isLogged.isLo().then(function(user_logged){
		if(user_logged) $location.path('main');
	}) 

	//po submitnuti loginformu postni data na server
	//ak vrati ze si zadal spravne meno a heslo tak redirect na main
	//ak bolo zadane zle meno a heslo zobraz warning 
	$scope.login = function(){
		var req = {
			method:'POST',
			url: 'login',
			data: {"username":$scope.username,"password":$scope.password}
		}

		$http(req).then(function successCallback(response) {
			$location.path('main');
		}, function errorCallback(response) {
			$scope.wrong_cred = true;
		});
	}
})



app.controller('MainCtrl', function($scope,$location,$http,isLogged) {

	//ak user_looged rovana sa true, user je prihlaseny cize ostavam na main
	//ak user_logged rovna sa false, user nie je prihlaseny tak treba presmerovat na login formular
	isLogged.isLo().then(function(user_logged){
		if(!user_logged) $location.path('login');
	})

	$http.get('/list_experiments').then(function(data){
		$scope.exps = data.data.experiments;
	},function(err){})
	
})