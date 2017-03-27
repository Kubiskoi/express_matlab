var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
	res.send('<h1>Hello world from vagrant</h1>');
}); 
var x = 0;
io.on('connection', function(socket){
	socket.on('input parameters',function(params){
		x++;
		console.log(x);
		io.emit('results back',x);
	})

})


http.listen(process.env.PORT || 3001, function(){
  console.log('listening on *:'+(process.env.PORT || 3001));
});