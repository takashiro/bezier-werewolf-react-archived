
$_MODULE['page/enter-room'] = ()=>{
	var root = $('#root');
	root.html('');

	var room_box = $('<div class="box"><h3>Room ID</h3></div>');
	var room_id = $('<span id="room-id"></span>');
	room_id.html(config.room.id);
	room_box.append(room_id);
	root.append(room_box);

	var role_box = $('<div id="role-box" class="box"><h3>Roles</h3></div>');
	var role_list = $('<ul class="role-list"><ul>');
	role_box.append(role_list);
	root.append(role_box);

	window.updateRoles = ()=>{
		role_list.html('');
		config.room.roles.forEach((role)=>{
			var li = $(`<li><div class="role ${role}"></div></li>`);
			role_list.append(li);
		});
	};
	updateRoles();

	var extra_card_box = $('<div id="extra-card-box" class="box" style="display: none"><h3>Extra Cards</h3></div>');
	var extra_card_list = $('<ul class="role-list" id="extra-card-list"></ul>');
	for (let i = 0; i < 3; i++) {
		let card = $('<li><div class="role background"></div></li>');
		extra_card_list.append(card);
	}
	extra_card_box.append(extra_card_list);
	root.append(extra_card_box);

	var online_box = $('<div class="box"><h3>Players</h3></div>');
	var online_list = $('<ul id="player-list" class="player-list"></ul>');
	online_box.append(online_list);
	root.append(online_box);

	var button_area = $('<div id="button-area" class="button-area"></div>');
	if (config.room.owner.id == config.user.id) {
		var start_button = $('<button type="button">START</button>');
		button_area.append(start_button);

		start_button.click(()=>{
			server.request(net.StartGame);
		});
	}
	root.append(button_area);

	window.addPlayer = (player)=>{
		var li = $('<li></li>');

		li.data('uid', player.id);

		var nickname = $('<div></div>');
		nickname.addClass('nickname');
		nickname.text(player.name ? player.name : player.id);
		li.append(nickname);

		var role_text = $('<div></div>');
		role_text.addClass('role-text');
		role_text.html('?');
		li.append(role_text);

		online_list.append(li);
	}
	config.room.players.push(config.user);
	config.room.players.forEach(addPlayer);

	window.removePlayer = (uid)=>{
		online_list.children().each(function(){
			var li = $(this);
			if(li.data('uid') == uid){
				li.remove();
				return false;
			}
			return true;
		});

		let players = config.room.players;
		for(let i = 0; i < players.length; i++){
			let player = players[i];
			if(player.id == uid){
				players.splice(i, 1);
				break;
			}
		}
	}
};