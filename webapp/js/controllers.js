app.controller('LoginCtrl', function($scope,$location,$http) {
	$scope.wrong_cred = false;
	
	var req = {
		method:'GET',
		url: 'get_logget_user'
	}

	$http(req).then(function successCallback(response){
		$location.path('main');
	},function errorCallback(response){
	})

	$scope.login = function(){
		// console.log("%s ,%s",$scope.username,$scope.password);
		// $location.path('main');
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



app.controller('MainCtrl', function($scope,$location,$http) {


	var req = {
		method:'GET',
		url: 'get_logget_user'
	}

	$http(req).then(function successCallback(response){
		console.log(response);
	},function errorCallback(response){
		$location.path('login');
	})
	// if server vrati false tak redirectnem na login
	// var pr = false;
	// if(pr == false){
	// 	$location.path('login');
	// }else{
	// 	// console.log('ostavam');
	// }
})