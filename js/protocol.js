
server.bind(net.RequestUserId, (user_id)=>{
	config.userId = user_id;
	server.request(net.Login, {
		uid: user_id
	});
});

server.bind(net.Login, (uid)=>{
	config.userId = uid;
	if (uid > 0) {
		if (!$_GET['room_id']) {
			server.request(net.RequestRoomId);
		} else {
			server.request(net.EnterRoom, {
				id: parseInt($_GET['room_id'], 10),
				game: 'onenightwerewolf'
			});
		}
	} else {
		makeToast('Login failed.');
	}
});

server.bind(net.RequestRoomId, (room_id)=>{
	if (room_id > 0) {
		config.roomId = room_id;
		server.request(net.CreateRoom, {
			id: room_id,
			game: 'onenightwerewolf'
		});
	} else {
		makeToast('Failed to create a new room. Server is too busy.');
	}
});

server.bind(net.CreateRoom, (room_id)=>{
	if (room_id > 0) {
		config.roomId = room_id;
	} else {
		makeToast('Failed to create a new room.');
	}
});

server.bind(net.SetUserList, (players)=>{
	config.players = players;
});

function requestUpdateRoom(){
	let roles = [];
	config.roles.forEach((str)=>{
		roles.push(PlayerRole.convertToNum(str));
	});

	server.request(net.UpdateRoom, {
		roles: roles
	});
}

server.bind(net.EnterRoom, (info)=>{
	config.roomId = info['room_id'];
	config.roomOwnerId = info['owner_id'];

	require('enter-room');
	if (config.roomOwnerId == config.userId) {
		requestUpdateRoom();
	}
});

server.bind(net.UpdateRoom, (args)=>{
	if (args.roles instanceof Array) {
		config.roles = [];
		args.roles.forEach((num)=>{
			config.roles.push(PlayerRole.convertToString(num));
		});

		if (typeof updateRoles == 'function') {
			updateRoles();
		}
	}
});

server.bind(net.AddUser, (uid)=>{
	if(!config.players.some((id)=>{id == uid})){
		config.players.push(uid);
		if (typeof addPlayer == 'function') {
			addPlayer(uid);
		}
	}
});

server.bind(net.RemoveUser, (uid)=>{
	for (let i = 0; i < config.players.length; i++) {
		if (uid == config.players[i]) {
			config.players.splice(i, 1);
			if (typeof removePlayer == 'function') {
				removePlayer(uid);
			}
			break;
		}
	}
});
