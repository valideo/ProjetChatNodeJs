function dynamicCss(){

		//On recupere la taille de l'ecran
		var fullheight = screen.height;
		var fullwidth = screen.width;

		zone_animation = document.getElementById('zone-animation');
		zone_chat = document.getElementById('zone_chat');
		formulaire_chat = document.getElementById('formulaire_chat');
		instructions = document.getElementById('instructions');

		var zone_animation_height = fullheight*0.50;
		var zone_animation_width = fullwidth*0.99;
		var zone_chat_height = fullheight*0.25;
		var zone_chat_width = fullwidth*0.4;

		//On applique des tailles au div statiques en fonction
		zone_animation.style.width = zone_animation_width +'px';
		zone_animation.style.height = zone_animation_height +'px';
		zone_chat.style.marginTop = zone_animation_height+1+'px';
		zone_chat.style.width = zone_chat_width +'px';
		zone_chat.style.height = zone_chat_height +'px';
		formulaire_chat.style.marginTop = zone_animation_height + zone_chat_height + 1 + 'px';
		formulaire_chat.style.width = zone_chat_width + 'px';
		instructions.style.width = zone_animation_width - zone_chat_width + 'px';
		instructions.style.height = zone_chat_height + 'px';
		instructions.style.marginTop = zone_animation_height + 1 + 'px';
		instructions.style.marginLeft = zone_chat_width + 1 + 'px';

	}

	window.setInterval(function(){
  dynamicCss();
}, 100);