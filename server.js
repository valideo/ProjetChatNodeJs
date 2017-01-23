var http = require('http');

httpServer = http.createServer(function(req,res){
	console.log('qqun est sur la page');
});

httpServer.listen(1010);

var io = require('socket.io').listen(httpServer);
var users = {};
var posusers = {};

io.sockets.on('connection', function(socket){

	//Affiche avatar users connectés avec leur position à la connexion
	var me = false;
	for(var k in users){
		socket.emit('newavatar',users[k]);
	}

	for(var k in posusers){
		socket.emit('newpos',posusers[k]);
	}

	//Connexion au chat
	socket.on('login', function(user){
		me = user;
		me.pseudo = user.username;
		me.avatar = 'src/static-face.png';
		if (me.pseudo.length <2 || me.pseudo.length > 15){
			socket.emit('retry');
		}
		else{
		socket.emit('logged');
		socket.broadcast.emit('newusr', me);
		io.sockets.emit('newavatar', me);
		socket.emit('moveavatar', me);
		users[me.pseudo] = me;
		};


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
		console.log('message envoyé');
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		socket.broadcast.emit('newmsg', message);
		socket.emit('ownmsg', message);
	});

	//Gestion position avatars 
	socket.on('move', function(pos){
		io.sockets.emit('newpos', pos);
		posusers[pos.identifiant] = pos;
	});


});

