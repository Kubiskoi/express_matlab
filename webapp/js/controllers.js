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



app.controller('MainCtrl', function($scope,$location,$http,isLogged,FileUploader) {

	//ak user_looged rovana sa true, user je prihlaseny cize ostavam na main
	//ak user_logged rovna sa false, user nie je prihlaseny tak treba presmerovat na login formular
	isLogged.isLo().then(function(user_logged){
		if(!user_logged) $location.path('login');
	})

	//ziskaj objekt {"experiments":['a','b']}
	this.load_experiments = function(){
		$http.get('/list_experiments').then(function(data){
			$scope.exps = data.data.experiments;
		},function(err){

		})
	}

	//ked sa nacita tento controller tak si spusti funkciu na nacitanie experimentov
	this.load_experiments();

	//angular file uploader
	//https://github.com/nervgh/angular-file-upload
	var that = this;
	$scope.uploader = new FileUploader();

	//ak sa uspesne uploadne zipnuty experiment tak si nacitam znova experimenty aby sa updatlo view
	$scope.uploader.onSuccessItem = function(item, response, status, headers) {
		that.load_experiments();
	};

	//ak nastane chyba pri uploade zip experimentu spadne server ale tak aspon dam klientovi vediet
	$scope.uploader.onErrorItem = function(item, response, status, headers) {
		alert('Something went wrong during uploadig! Server needs to be restarted!');
	};

})