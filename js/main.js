
var server = new Server;
var config = {
	roomId: 0
};

const net = declareCommands(
	'StartGame',
	'DeliverRoleCard',
	'ChoosePlayer',
	'EndGame',

	'AllCommandCount'
);

function showMessage(message){
	$('#root').html(`<div class="message">${message}</div>`);
}

server.on('open', ()=>{
	if ($_GET['room_id']) {
		config.roomId = $_GET['room_id'];
		require('enter-room');
	} else {
		require('create-room');
	}
});

server.on('close', ()=>{
	showMessage('Failed to establish a connection to ' + server.url);
});

$(()=>{
	if ($_GET['server']) {
		showMessage('Loading...');
		server.connect($_GET['server']);
	}
});
