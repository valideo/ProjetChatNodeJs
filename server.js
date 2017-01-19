var http = require('http');

httpServer = http.createServer(function(req,res){
	console.log('qqun est sur la page');
});

httpServer.listen(1010);

var io = require('socket.io').listen(httpServer);
var users = {};

io.sockets.on('connection', function(socket){

	var me = false;
	for(var k in users){
		socket.emit('newavatar',users[k]);
	}

	//Connexion au chat
	socket.on('login', function(user){
		me = user;
		me.pseudo = user.username;
		me.avatar = 'src/static-face.png';
		socket.emit('logged');
		socket.broadcast.emit('newusr', me);
		io.sockets.emit('newavatar', me);
		users[me.pseudo] = me;

		//Deconnexion au chat
		socket.on('disconnect', function(){
			if(!me){
				return false;
			}
			delete users[me.pseudo];
			io.sockets.emit('disusr', me);
		});

	});

	//Gestion des messages
	socket.on('newmsg',function(message){
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		io.sockets.emit('newmsg', message);

});