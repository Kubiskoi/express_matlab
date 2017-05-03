// LIBS
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var shell = require('shelljs');
var cookieParser = require('cookie-parser');
var busboy = require('connect-busboy');


// ROUTES
var loginR = require('./routes/loginR.js');
var listExpsR = require('./routes/listExpsR.js');
var receiveExpR = require('./routes/receiveExpR.js');
var deleteExperimentR = require('./routes/deleteExperimentR.js');
var downloadExperimentR = require('./routes/downloadExperimentR.js');
var detailR = require('./routes/detailR.js');
var logoutR = require('./routes/logoutR.js');
var isLoggedR = require('./routes/isLoggedR.js');



app.use(session({
    key: 'userID',
    secret: 'wow magic',
    cookie: {maxAge: 900000},
    rolling: true,
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(cookieParser())
app.use('/', express.static('webapp'));
app.use(express.static(path.join(__dirname, 'index.html')));



app.post('/login', loginR);
app.get('/list_experiments', listExpsR);

app.use(busboy());
app.post('/save_new_exp', receiveExpR);
app.use(bodyParser.json());

app.delete('/delete_experiment/:del_exp_name',deleteExperimentR);
app.get('/download_experiment/:exp_name',downloadExperimentR);
app.get('/detail/:exp_name',detailR);
app.get('/logout',logoutR);
//overi clientovi ci je prihlasny, vrati 200 ak je prihlaseny, vrati false ak nie je prihlaseny
app.get('/get_logged_user',isLoggedR);


//=================================================================================================
//=================================================================================================
//MATLABOVSKA CAST

app.post('/matlab/result',function(req,res){
	//emit pre uzivatela 
	io.emit('results_for:'+req.body.result.user,req.body);
	//odpovedam matlabu
	res.sendStatus(200);
})


io.on('connection', function(socket){	
	socket.on('input parameters',function(params){
		var k = "{";
		var v = "{"
		// var cmd = '/Applications/MATLAB_R2015b.app/bin/matlab -nosplash -nodesktop -noFigureWindows -r cd '+__dirname+'/simulacie/'+params.foldername+';'+params.mfilepar+'('+params.v0+','+params.alfa+',"'+params.logged_user+'");'+params.mfilescript+';exit;';
		// console.log(params);
		// console.log(cmd);
		
		params.inputs.forEach(function(item,index){
			k=k+"'"+Object.keys(item)[0]+"',";
			v=v+item[Object.keys(item)[0]]+",";
		});
		k = k+"'logged_user','ipadrs','port'";
		k=k+"}";
		// console.log(k);	
		v = v+"'"+params.logged_user+"','"+params.ipadrs+"','"+params.port+"'";
		v=v+"}";
		// console.log(v);	

		// https://www.mathworks.com/help/matlab/matlab_prog/creating-a-map-object.html
		// https://www.mathworks.com/help/matlab/ref/containers.map.values.html
		var map = "inpMap = containers.Map("+k+", "+v+")";
		// console.log(map);
		//po spusteni matlabu sa dalsie prikazy vykonavaju v matlabovskom prostredi
		var cmd = '\/Applications\/MATLAB_R2015b.app\/bin\/matlab -nosplash -nodesktop -noFigureWindows -r \"cd '+__dirname+'/simulacie\/'+params.foldername+';'+map+';'+params.mfilepar+'(inpMap);'+params.mfilescript+';exit;\"';
		shell.exec(cmd, function (code, stdout, stderr) {
		    console.log('matlab exit');
		});
	
	})	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
}); 

//=================================================================================================
//=================================================================================================

http.listen(process.env.PORT || 3001, function(){
  console.log('listening on *:'+(process.env.PORT || 3001));
});