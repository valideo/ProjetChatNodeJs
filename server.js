var http = require('http');

httpServer = http.createServer(function(req,res){
	console.log('qqun est sur la page');
});

httpServer.listen(8080);

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket){

	var me;

	socket.on('login', function(user){
		me = user;
		me.id = user.username;
		socket.broadcast.emit('newusr', me);
		socket.emit('logged');
	})

});