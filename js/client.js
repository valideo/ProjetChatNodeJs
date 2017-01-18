(function($){

	var socket = io.connect('http://localhost:8080');

	$('#loginform').submit(function(event){
		event.preventDefault();

		socket.emit('login',{
			pseudo : $('#username').val()
		})
	})

	socket.on('newusr', function(user){
		alert('Nouvel utilisateur' + user);
	})

	socket.on('logged', function(){
		$('#login').fadeOut();s
	})

})(jQuery);

while('#username'.length < 2 || '#username'.length > 15){
	alert('Votre pseudo doit contenir entre 3 et 5 caractères !');
}