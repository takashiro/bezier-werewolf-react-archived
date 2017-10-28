
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

server.bind(net.SetUserList, (user_id_list)=>{
	makeToast(user_id_list.join(','));
});

server.bind(net.EnterRoom, (info)=>{
	config.roomId = info['room_id'];
	config.roomOwnerId = info['owner_id'];

	require('enter-room');
});
