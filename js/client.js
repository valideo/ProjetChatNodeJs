(function($){

	var socket = io.connect('http://localhost:1010');
	$('#username').focus();
	//Recupération Login
	$('#loginform').submit(function(event){
		event.preventDefault();
		socket.emit('login',{
			username : $('#username').val()
		})
	});


	//Affichage interface et cacher page login
	socket.on('logged', function(){
		$('#login').fadeOut();
		$('.interface').fadeIn();
		$('#message').focus();
	});


//Création des évènements de connexion

	//Affichage de connexion sur chat
	socket.on('newusr', function(user){
		$('#zone_chat').append('<p class="messages-chat" style="color : #754220;"><em>' + user.pseudo + ' vient de se connecter</em></p>');
		document.title = user.pseudo + ' | ' + document.title;
	});

	//Ajout de l'avatar sur la map
	socket.on('newavatar', function(user){
		$('#zone-animation').append('<img src="'+user.avatar+'" id="'+user.pseudo+'" alt="avatar" width="70px">');
	});


//Gestion de la déconnexion

	//Suppression de l'avatar sur la map et affichage déconnexion chat
	socket.on('disusr', function(user){
		$('#' + user.pseudo).remove();
		$('#zone_chat').append('<p class="messages-chat" style="color : #754220;"><em>' + user.pseudo + ' vient de se déconnecter</em></p>');
	})


//Gestion des messages
	$('#form').submit(function(event){
		event.preventDefault();
		socket.emit('newmsg', {message : $('#message').val() });
		$('#message').val('');
		$('#message').focus();
	});

	socket.on('newmsg', function(message){
		
	})

})(jQuery);



/* a faire à la fin conditions pseudo
while('#username'.length < 2 || '#username'.length > 15){
	alert('Votre pseudo doit contenir entre 3 et 5 caractères !');
}
*/