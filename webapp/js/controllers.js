app.controller('LoginCtrl', function($scope,$location,$http,isLogged,$timeout) {
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

		$http(req).then(function(response) {
			$location.path('main');
		}, function(response) {
			$scope.wrong_cred = true;
			//skovaj warovanie o zlom mene alebo heslo po 2s
			$timeout(function(){
				$scope.wrong_cred=false;
			},2000);
		});
	}
})



app.controller('MainCtrl', function($scope,$location,$http,isLogged,FileUploader,$cookies) {

	//jQuery tu funguje kedze v index.html je nacitany
	$('.modal').modal();

	//inicializacia pola pre experimenty
	$scope.exps = [];

	$scope.logged_user = $cookies.get('logged_user_name');


	//mali hack aby sa dali zatvarat a otvarat vylistovane foldre
	$scope.li_clicked = function(ev){
		ev.stopPropagation();
		$(ev.currentTarget).find('ul').toggle();
	}

	
	
	//ak user_looged rovana sa true, user je prihlaseny cize ostavam na main
	//ak user_logged rovna sa false, user nie je prihlaseny tak treba presmerovat na login formular
	isLogged.isLo().then(function(user_logged){
		if(!user_logged) $location.path('login');
	})

	//ziskaj objekt {"experiments":[{},{}]}
	this.load_experiments = function(){
		$scope.exps = [];
		$http.get('/list_experiments').then(function(data){

			//pre kazde meno ziskaj file structure, mohol to byt jeden request ale uz som mal backend takto tak to nebudem zas prerabat
			//priestor na vylepsenie
			angular.forEach(data.data.experiments,function(value){
				$http.get('/detail/'+value).then(function(data){
					$scope.exps.push(data.data);
				},function(err){})
			})
		},function(err){

		})
	}

	//ked sa nacita tento controller tak si spusti funkciu na nacitanie experimentov
	this.load_experiments();

	//angular file uploader
	//https://github.com/nervgh/angular-file-upload
	var that = this;
	$scope.uploader = new FileUploader({queueLimit: 1});

	$scope.uploader.filters.push({name:'filter1', fn:function(data) {
		
		// ak posledne 4 znaky nazvu vybraneho suboru niesu .zip, nie je to zip tak vrat false cize ho neprida do upload qeueu
		if( data.name.slice(data.name.length-4,data.name.length) == '.zip' ){
			
			var already_exist = false;
			//ak je teda zip, prejdem vsetky exps co je pole objektov uz priecinkov na servery,
			// mam ich v scope lebo sa nacitali hned ako sa loadla stranka
			// porovnamvam nazov a musim odstranit '.zip' z nazvu pre korektne porovnanie
			//ak najdem zhodu ulozim som true do premmennej already_exist
			angular.forEach($scope.exps,function(item){
				if( item.name == data.name.slice(0,data.name.length-4)){
					// alert('File with same name already uploaded!');
					$('#same_name_modal').modal('open');
					already_exist = true;
				}
			});
			//ak already_exist == true, tak uz existuje na serveri priecinok s takym menom
			//tak vratim false aby upload nepokracoval, inak vratim true nech upload pokracuje
			if(already_exist)return false;
			else return true;
		}else{
			// alert('File must be .zip!');
			$('#must_zip_modal').modal('open');
			return false;
		}
	}});

	//ak sa uspesne uploadne zipnuty experiment tak si nacitam znova experimenty aby sa updatlo view
	$scope.uploader.onSuccessItem = function(item, response, status, headers) {
		$scope.uploader.clearQueue();
		that.load_experiments();
	};

	//ak nastane chyba pri uploade zip experimentu spadne server ale tak aspon dam klientovi vediet
	$scope.uploader.onErrorItem = function(item, response, status, headers) {
		alert('Something went wrong during uploadig! Server needs to be restarted!');
	};

	

	//stlaci ikonu kontaineru vyskoci modal pre potvrdenie vymazania experimentu
	$scope.delete = function(about_to_be_deleted){
		$scope.about_to_be_deleted = about_to_be_deleted;
		$('#delete_modal').modal('open');
	}

	//ak potvrdi zrusenenie experimentu sprav delete na server a successful callback
	// zavri modal a refresni experimenty
	$scope.confirmedDeletion = function(delete_exp){
		$http.delete('/delete_experiment/'+delete_exp).then(function(){
			$('#delete_modal').modal('close');
			that.load_experiments();
		},function(err){})
	}

	//ak nepotvrdi zrusenie experimentu iba zavri modal
	$scope.noDelete = function(){
		$('#delete_modal').modal('close');
	}

	//server zazipuje dane meno experimentu a stiahne
	$scope.download = function(name){
		
		$http.get('/download_experiment/'+name,{responseType: "blob"}).then(function(data, status, headers, config){
			
			//https://jsfiddle.net/koldev/cW7W5/
			var blob = new Blob([data.data], {type: "octet/stream"});
			var url = window.URL.createObjectURL(blob);
			var a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";
			a.href = url;
			a.download = name+'.zip';
			a.click();
			window.URL.revokeObjectURL(url);
			a.parentNode.removeChild(a);

		},function(err){})
	}


	$scope.logout = function(){
		$http.get('/logout').then(function(data){
			$location.path('login');
		},function(err){
			alert('Server Error!');
		})
	}
	
})














