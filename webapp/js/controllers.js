app.controller('LoginCtrl', function($scope,$location,$http) {
	$scope.wrong_cred = false;
	
	//sprav get na get_logged_user
	//ak vrati ok, cize som prihlasney cize redirect na main
	//ak vratie 401 unauthorized tak nic sa nedeje lebo som na login screene tak tu ostanem
	var req = {
		method:'GET',
		url: 'get_logged_user'
	}
	$http(req).then(function successCallback(response){
		$location.path('main');
	},function errorCallback(response){
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
			$scope.wrong_cred = false;
		});
	}
})



app.controller('MainCtrl', function($scope,$location,$http) {

	//ak sa hitne route main tak over ci som prohlaseny
	//ak som prihlaseny vsetko ok nic sa nedeje
	//ak sa vrati 401 unauthorized tak redirect na login
	var req = {
		method:'GET',
		url: 'get_logged_user'
	}

	$http(req).then(function successCallback(response){
	},function errorCallback(response){
		$location.path('login');
	})
})