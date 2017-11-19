
var server = new Server;
var config = {
	room: {
		id: 0,
		owner: {
			id: 0
		},
		roles: [],
		players: [],

		findPlayer: function(uid){
			for(let player of this.players){
				if(player.id == uid){
					return player;
				}
				return null;
			}
		}
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
			require('page/join-room');
		} else {
			require('page/create-room');
		}
	});
});

server.on('close', ()=>{
	showMessage('Failed to establish a connection to ' + server.url);
});

$(()=>{
	showMessage('Loading...');
	if($_GET['server']){
		server.connect($_GET['server']);
	}else{
		let match = location.href.match(/(\w+)\:\/\/(.*?)(?:\/.*)?/i);
		if(match){
			if(match[1] == 'file'){
				server.connect('localhost');
			}else{
				serrver.connect(match[2]);
			}
		}
	}
});
