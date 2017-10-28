
server.bind(net.RequestUserId, (user_id)=>{
	config.userId = user_id;
	server.request(net.Login, {
		uid: user_id
	});
});

server.bind(net.Login, (uid)=>{
	config.userId = uid;
	if (uid > 0) {
		server.request(net.RequestRoomId);
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

server.bind(net.EnterRoom, (info)=>{
	config.roomId = info['room_id'];
	config.roomOwnerId = info['owner_id'];

	require('enter-room');
});

server.bind(net.AddUser, (uid)=>{
	if(!config.players.some((id)=>{id == uid})){
		config.players.push(id);
		if (addPlayer) {
			addPlayer(id);
		}
	}
});

server.bind(net.RemoveUser, (uid)=>{
	for (let i = 0; i < config.players.length; i++) {
		if (uid == config.players[i]) {
			config.players.splice(i, 1);
			if (removePlayer) {
				removePlayer(uid);
			}
		}
	}
});
