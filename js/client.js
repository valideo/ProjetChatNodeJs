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

	//Check taille pseudo
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
		$('#zone-animation').append('<div id="'+user.pseudo+'" style="position : absolute; top : 50%; left : 50%; display: inline-block; width : 80px;"><p style="color : #754220; font-size : 20px; text-align : center; margin-bottom : -6px;">'+user.pseudo+'</p><img id="avatar'+user.pseudo+'" src="'+user.avatar+'" alt="avatar" width="70px"></div>');
		
	});


//Gestion de la déconnexion

	//Suppression de l'avatar sur la map et affichage déconnexion chat
	socket.on('disusr', function(user){
		$('#' + user.pseudo).remove();
		$('#zone_chat').append('<p class="text-chat" style="color : #754220;"><em>' + user.pseudo + ' vient de se déconnecter</em></p>');
	})


//Gestion des messages	
	//Emission message formulaire
	$('#form').submit(function(event){
		event.preventDefault();
		socket.emit('newmsg', {message : $('#message').val() });
		$('#message').val('');
		$('#message').focus();
	});

	//Affiche message d'un autre utilisateur
	socket.on('newmsg', function(message){
		//Ajout séparateur espace si utilisateur != dernier message
		if(lastmsg != message.user.pseudo) {
			$('#zone_chat').append('<div class="sep"></div>');
			lastmsg = message.user.pseudo;
		}
		$('#zone_chat').append('<div class="section-message-chat"' + Mustache.render(msgtpl, message) + '</div>');
		$('#zone_chat').animate({scrollTop : $('#zone_chat').prop('scrollHeight')}, 500);
	});

	//Affichage de son propre emssage
	socket.on('ownmsg', function(message){
		//Ajout séparateur espace si utilisateur != dernier message
		if(lastmsg != message.user.pseudo) {
			$('#zone_chat').append('<div class="sep"></div>');
			lastmsg = message.user.pseudo;
		}
		$('#zone_chat').append('<div class="own-section-message-chat"' + Mustache.render(ownmsg, message) + '</div>');
		$('#zone_chat').animate({scrollTop : $('#zone_chat').prop('scrollHeight')}, 500);
	});


//Gestion déplacement des personnages sur la zone-animation
	var container = document.getElementById('zone-animation');
	var guyleft = 50;
	var guyup = 50;

	function anim(e) {
		//Deplacement a droite
		if(e.keyCode == 39){
			guyleft += 0.4;
			if(guyleft >= 94.5){
				guyleft = 94.5;
			}
			//Emission nouvelle position horizontale
			socket.emit('move', {direction : 'right', top : guyup, left : guyleft, identifiant : ID});
		}

		//Deplacement a gauche
		if(e.keyCode == 37){
			guyleft -= 0.4;
			if(guyleft <= 0){
				guyleft = 0;
			}
			//Emission nouvelle position horizontale
			socket.emit('move', {direction : 'left',top : guyup, left : guyleft, identifiant : ID});
		}

		//Deplacement en haut
		if(e.keyCode == 38){
			guyup -= 0.7;
			if(guyup <= 0){
				guyup = 0;
			}
			//Emission nouvelle position verticale
			socket.emit('move', {direction : 'top', top : guyup, left : guyleft, identifiant : ID});
		}

		//Deplacement en bas
		if(e.keyCode == 40){
			guyup += 0.7;
			if(guyup >= 85.2){
				guyup = 85.2;
			}
			//Emission nouvelle position verticale
			socket.emit('move', {direction : 'bottom', top : guyup, left : guyleft, identifiant : ID});
		}

	}

	document.onkeydown = anim;

	//Affichage nouvelle position des avatars sur la zone
	socket.on('newpos',function(pos){
		element = document.getElementById(pos.identifiant);
		avatarimg = document.getElementById('avatar'+pos.identifiant);


		element.style.left = pos.left + '%';
		element.style.top = pos.top + '%';

		if(pos.direction == 'right'){
			avatarimg.src="src/static-right.png";
		}
		else if(pos.direction == 'left'){
			avatarimg.src="src/static-left.png";
		}
		else if(pos.direction == 'top'){
			avatarimg.src="src/static-dos.png";
		}
		else if(pos.direction == 'bottom'){
			avatarimg.src="src/static-face.png";
		}
	});

})(jQuery);
