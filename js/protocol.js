
function requestUpdateName(receiver){
	var arg = {
		info: {
			name: config.user.name
		}
	};
	if (typeof receiver != 'undefined') {
		arg.receiver = receiver;
	}
	server.request(net.UpdatePlayer, arg);
}

server.bind(net.RequestUserId, (user_id)=>{
	config.user.id = user_id;
	server.request(net.Login, {
		uid: user_id
	});
});

server.bind(net.Login, (uid)=>{
	config.user.id = uid;
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
		config.room.id = room_id;
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
		config.room.id = room_id;
	} else {
		makeToast('Failed to create a new room.');
	}
});

server.bind(net.SetUserList, (players)=>{
	config.room.players = players;
	requestUpdateName();
});

function requestUpdateRoom(){
	let roles = [];
	config.room.roles.forEach((str)=>{
		roles.push(PlayerRole.convertToNum(str));
	});

	server.request(net.UpdateRoom, {
		roles: roles
	});
}

server.bind(net.EnterRoom, (info)=>{
	config.room.id = info['room_id'];
	config.room.owner.id = info['owner_id'];

	require('enter-room');
	if (config.room.owner.id == config.user.id) {
		requestUpdateRoom();
	}
});

server.bind(net.UpdateRoom, (args)=>{
	if (args.roles instanceof Array) {
		config.room.roles = [];
		args.roles.forEach((num)=>{
			config.room.roles.push(PlayerRole.convertToString(num));
		});

		if (typeof updateRoles == 'function') {
			updateRoles();
		}
	}
});

server.bind(net.AddUser, (uid)=>{
	if(!config.room.players.some((id)=>{id == uid})){
		config.room.players.push(uid);
		requestUpdateName(uid);
		if (typeof addPlayer == 'function') {
			addPlayer(uid);
		}
	}
});

server.bind(net.RemoveUser, (uid)=>{
	for (let i = 0; i < config.room.players.length; i++) {
		if (uid == config.room.players[i]) {
			config.room.players.splice(i, 1);
			if (typeof removePlayer == 'function') {
				removePlayer(uid);
			}
			break;
		}
	}
});

server.bind(net.UpdatePlayer, (info)=>{
	var users = $('ul#player-list li');
	users.each(function(){
		var user = $(this);
		if(user.data('uid') != info.id) {
			return;
		}

		if(info.name){
			user.text(info.name);
		}
	});
});

server.bind(net.StartGame, ()=>{
	require('start-game');
});

server.bind(net.DeliverRoleCard, (role)=>{
	role = PlayerRole.convertToString(role);
	config.user.role = role;
	if(typeof updateRole == 'function'){
		updateRole();
	}
});

server.bind(net.UpdatePhase, (role)=>{
	var role_box = $('#current_role');
	if(role > 0){
		role = PlayerRole.convertToString(role);
		role_box.html(role.toUpperCase());
	}else{
		role_box.html('Daytime~~');
	}
});

server.bind(net.ChoosePlayer, (num)=>{
	var message_box = $('#message_box');
	var s = num > 1 ? 's' : '';
	message_box.html(`Please select ${num} player${s}`);
});
