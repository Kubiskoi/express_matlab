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


var loginR = require('./routes/loginR.js');
var listExpsR = require('./routes/listExpsR.js');
var receiveExpR = require('./routes/receiveExpR.js');



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


//overi clientovi ci je prihlasny, vrati 200 ak je prihlaseny, vrati false ak nie je prihlaseny
app.get('/get_logged_user', function(req,res){

	//tu overujem ci moj randomny vygenerovany session string je rovnaky u klienta v cookies ako aj na serveri
	//a ci vobec exsituje takyto string, lebo aj dva krat undefined sa rovna ale vtedy nie je nikto prihlaseny
	if(req.session.lu == req.cookies.lu && req.session.lu && req.cookies.lu){
		res.sendStatus(200);
	}else{
		res.sendStatus(401);
	}
});





app.post('/matlab/result',function(req,res){
	// console.log(req.body);

	io.emit('results back',req.body);
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
		k = k+"'logged_user'";
		k=k+"}";
		// console.log(k);	
		v = v+"'"+params.logged_user+"'";
		v=v+"}";
		// console.log(v);	

		// https://www.mathworks.com/help/matlab/matlab_prog/creating-a-map-object.html
		// https://www.mathworks.com/help/matlab/ref/containers.map.values.html
		var map = "inpMAp = containers.Map("+k+", "+v+")";
		// console.log(map);
		var cmd = '\/Applications\/MATLAB_R2015b.app\/bin\/matlab -nosplash -nodesktop -noFigureWindows -r \"cd '+__dirname+'/simulacie\/'+params.foldername+';'+map+';'+params.mfilepar+'(inpMAp);'+params.mfilescript+';exit;\"';
		shell.exec(cmd, function (code, stdout, stderr) {
		    console.log('matlab exit');
		});
	
	})	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
}); 

http.listen(process.env.PORT || 3001, function(){
  console.log('listening on *:'+(process.env.PORT || 3001));
});