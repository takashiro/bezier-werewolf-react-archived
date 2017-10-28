
var server = new Server;

function showMessage(message){
	$('#root').html(`<div class="message">${message}</div>`);
}

server.on('open', ()=>{
	require('create-room');
});

server.on('close', ()=>{
	showMessage('Failed to establish a connection to ' + server.url);
});

$(()=>{
	if ($_GET.server) {
		showMessage('Loading...');
		server.connect($_GET.server);
	}
});