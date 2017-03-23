var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');


var shell = require('shelljs');

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('<h1>Hello world</h1>');
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