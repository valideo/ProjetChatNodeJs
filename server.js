var app = require('express')();
var server = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/css/style.css', function(req, res){
    res.sendFile(__dirname + '/css/style.css');
});
app.get('/js/client.js', function(req, res){
    res.sendFile(__dirname + '/js/client.js');
});
app.get('/node_modules/mustache/mustache.min.js', function(req, res){
    res.sendFile(__dirname + '/node_modules/mustache/mustache.min.js');
});
app.get('/js/socket.io.js', function(req, res){
    res.sendFile(__dirname + '/js/socket.io.js');
});
app.get('/js/adaptivecss.js', function(req, res){
    res.sendFile(__dirname + '/js/adaptivecss.js');
});

app.get('/src/static-face.png', function(req, res){
    res.sendFile(__dirname + '/src/static-face.png');
});
app.get('/src/static-dos.png', function(req, res){
    res.sendFile(__dirname + '/src/static-dos.png');
});
app.get('/src/static-right.png', function(req, res){
    res.sendFile(__dirname + '/src/static-right.png');
});
app.get('/src/static-left.png', function(req, res){
    res.sendFile(__dirname + '/src/static-left.png');
});
app.get('/src/arrows.png', function(req, res){
    res.sendFile(__dirname + '/src/arrows.png');
});

server.listen(1010);
console.log('server listening on port 1010');

var io = require('socket.io').listen(server);
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
		console.log('pseudo envoyé');
		me = user;
		me.pseudo = user.username;
		me.avatar = 'src/static-face.png';
		if (me.pseudo.length <3 || me.pseudo.length > 10){
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

