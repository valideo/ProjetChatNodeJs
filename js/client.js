(function($){

	var socket = io.connect('localhost:1010');
	var msgtpl = $('#msgtpl').html();
	var ownmsg = $('#ownmsg').html();
	var lastmsg = false;
	var ID = " ";
	var guy = " ";
	IDMsg = 0;


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
		alert('Pseudo entre 3 et 10 caractères !!');
		/*socket.emit('login',{
			username : $('#username').val()
		})*/
	});


//Création des évènements de connexion

	//Affichage de connexion sur chat
	socket.on('newusr', function(user){
		$('#zone_chat').append('<p class="text-chat" style="color : #754220; font-size : 1em;"><em>' + user.pseudo + ' vient de se connecter</em></p>');
		$('#zone_chat').animate({scrollTop : $('#zone_chat').prop('scrollHeight')}, 500);
	});


	//Ajout de l'avatar sur la map
	socket.on('newavatar', function(user){
		$('#zone-animation').append('<div id="'+user.pseudo+'" style="position : absolute; top : 50%; left : 50%; display: inline-block; width : 80px;"><div id="'+user.pseudo+'-message-avatar"></div><p style="color : #754220; font-size : 0.8em; text-align : center; margin-bottom : -0.2em;">'+user.pseudo+'</p><img id="avatar'+user.pseudo+'" src="'+user.avatar+'" alt="avatar" width="70px"></div>');
		
	});


//Gestion de la déconnexion

	//Suppression de l'avatar sur la map et affichage déconnexion chat
	socket.on('disusr', function(user){
		$('#' + user.pseudo).remove();
		$('#zone_chat').append('<p class="text-chat" style="color : #754220; font-size : 1em;"><em>' + user.pseudo + ' vient de se déconnecter</em></p>');
		$('#zone_chat').animate({scrollTop : $('#zone_chat').prop('scrollHeight')}, 500);
	})


//Gestion des messages	
	//Emission message formulaire
	$('#form').submit(function(event){
		event.preventDefault();
		socket.emit('newmsg', {message : $('#message').val(), IDmessage : IDMsg });
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

		$('#zone_chat').append('<div class="section-message-chat">' + Mustache.render(msgtpl, message) + '</div>');
		$('#zone_chat').animate({scrollTop : $('#zone_chat').prop('scrollHeight')}, 500);
		$('#'+message.user.pseudo+'-message-avatar').append('<p id="'+message.user.pseudo+''+message.IDmessage+'" style=" z-index : 20;color : #754220; background-color : rgba(0,0,0,0.1); font-size : 1.3em; position : absolute; text-align : center; height : auto; width : 12em; border : solid 1px #754220; margin-left: -4em;">'+message.message+'</p>');
		document.getElementById(''+message.user.pseudo+message.IDmessage+'').style.top = -($('#'+message.user.pseudo+message.IDmessage).height())-5 + 'px';

		$('#'+message.user.pseudo+message.IDmessage).fadeOut(2500);
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
		$('#'+ID+'-message-avatar').append('<p id="'+message.user.pseudo+''+message.IDmessage+'" style="z-index : 20; color : #754220; background-color : rgba(0,0,0,0.1); font-size : 1.1em; position : absolute; text-align : center; height : auto; width : 12em; border : solid 1px #754220; margin-left : -4em;">'+message.message+'</p>');
		document.getElementById(''+message.user.pseudo+message.IDmessage+'').style.top = -($('#'+message.user.pseudo+message.IDmessage).height())-5 + 'px';

		$('#'+message.user.pseudo+message.IDmessage).fadeOut(2500);

		IDMsg += 1;
	});


//Gestion déplacement des personnages sur la zone-animation
	var container = document.getElementById('zone-animation');
	var guyleft = 50;
	var guyup = 50;

	function anim(e) {
		//Deplacement a droite
		if(e.keyCode == 39){
			$('#zone-animation').focus();
			guyleft += 0.4;
			if(guyleft >= 96){
				guyleft = 96;
			}
			//Emission nouvelle position horizontale
			socket.emit('move', {direction : 'right', top : guyup, left : guyleft, identifiant : ID});
		}

		//Deplacement a gauche
		if(e.keyCode == 37){
			$('#zone-animation').focus();
			guyleft -= 0.4;
			if(guyleft <= 0){
				guyleft = 0;
			}
			//Emission nouvelle position horizontale
			socket.emit('move', {direction : 'left',top : guyup, left : guyleft, identifiant : ID});
		}

		//Deplacement en haut
		if(e.keyCode == 38){
			$('#zone-animation').focus();
			guyup -= 0.7;
			if(guyup <= 0){
				guyup = 0;
			}
			//Emission nouvelle position verticale
			socket.emit('move', {direction : 'top', top : guyup, left : guyleft, identifiant : ID});
		}

		//Deplacement en bas
		if(e.keyCode == 40){
			$('#zone-animation').focus();
			guyup += 0.7;
			if(guyup >= 81.7){
				guyup = 81.7;
			}
			//Emission nouvelle position verticale
			socket.emit('move', {direction : 'bottom', top : guyup, left : guyleft, identifiant : ID});
		}

		if(e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 37 && e.keyCode != 39){
			$('#message').focus();
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
