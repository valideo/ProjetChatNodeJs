(function($){

	var socket = io.connect('http://localhost:1010');
	var msgtpl = $('#msgtpl').html();
	var ownmsg = $('#ownmsg').html();
	var lastmsg = false;
	var ID = " ";
	var guy = " ";


	$('#msgtpl').remove();

	$('#username').focus();
	//Recupération Login
	$('#loginform').submit(function(event){
		event.preventDefault();
		socket.emit('login',{
			username : $('#username').val()
		})
		ID = $('#username').val()
	});


	//Affichage interface et cacher page login
	socket.on('logged', function(){
		$('#login').fadeOut();
		$('.interface').fadeIn();
		$('#message').focus();
	});

	socket.on('retry', function(){
		alert('Pseudo entre 3 et 15 caractères !!');
		event.preventDefault();
		socket.emit('login',{
			username : $('#username').val()
		})
	});


//Création des évènements de connexion

	//Affichage de connexion sur chat
	socket.on('newusr', function(user){
		$('#zone_chat').append('<p class="text-chat" style="color : #754220;"><em>' + user.pseudo + ' vient de se connecter</em></p>');
	});

	//Ajout de l'avatar sur la map
	socket.on('newavatar', function(user){
		$('#zone-animation').append('<div id="'+user.pseudo+'" style="position : relative; display: inline-block; width : 80px;"><p style="color : #754220; font-size : 20px; text-align : center; margin-bottom : -6px;">'+user.pseudo+'</p><img src="'+user.avatar+'" alt="avatar" width="70px"></div>');
		
	});

	socket.on('moveavatar', function(user){
		guy = document.getElementById(ID);
	});


//Gestion de la déconnexion

	//Suppression de l'avatar sur la map et affichage déconnexion chat
	socket.on('disusr', function(user){
		$('#' + user.pseudo).remove();
		$('#zone_chat').append('<p class="text-chat" style="color : #754220;"><em>' + user.pseudo + ' vient de se déconnecter</em></p>');
	})


//Gestion des messages
	$('#form').submit(function(event){
		event.preventDefault();
		socket.emit('newmsg', {message : $('#message').val() });
		$('#message').val('');
		$('#message').focus();
	});

	socket.on('newmsg', function(message){
		if(lastmsg != message.user.pseudo) {
			$('#zone_chat').append('<div class="sep"></div>');
			lastmsg = message.user.pseudo;
		}
		//alert(lastmsg);
		$('#zone_chat').append('<div class="section-message-chat"' + Mustache.render(msgtpl, message) + '</div>');
		$('#zone_chat').animate({scrollTop : $('#zone_chat').prop('scrollHeight')}, 500);
	});

	socket.on('ownmsg', function(message){
		if(lastmsg != message.user.pseudo) {
			$('#zone_chat').append('<div class="sep"></div>');
			lastmsg = message.user.pseudo;
		}
		//alert(lastmsg);
		$('#zone_chat').append('<div class="own-section-message-chat"' + Mustache.render(ownmsg, message) + '</div>');
		$('#zone_chat').animate({scrollTop : $('#zone_chat').prop('scrollHeight')}, 500);
	});



	var container = document.getElementById('zone-animation');
	var guyleft = 0;
	function anim(e) {

		if(e.keyCode == 39){
			console.log(guy);
			guyleft += 2;
			guy.style.left = guyleft + 'px';
		}

		if(e.keyCode == 37){
			console.log(container);
			guyleft -= 2;
			guy.style.left = guyleft + 'px';
		}

	}

	document.onkeydown = anim;

})(jQuery);
