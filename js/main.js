
var server = new Server;
var config = {
	room: {
		id: 0,
		owner: {
			id: 0
		},
		roles: [],
		players: []
	},
	user: {
		id: 0,
		name: ''
	}
};

function showMessage(message){
	$('#root').html(`<div class="message">${message}</div>`);
}

server.on('open', ()=>{
	require('protocol', ()=>{
		if ($_GET['room_id']) {
			require('join-room');
		} else {
			require('create-room');
		}
	});
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
