
const server = new Server;

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

server.bind(net.RequestUserId, user_id => {
	config.user.id = user_id;
	server.request(net.Login, {
		uid: user_id
	});

	window.localStorage.setItem('nickname', config.user.name);
});

function EnterRoom(){
	if (!$_GET['room_id']) {
		require('page/create-room');
	} else {
		server.request(net.EnterRoom, {
			id: parseInt($_GET['room_id'], 10),
			game: 'onenightwerewolf'
		});
	}
}

server.bind(net.Login, uid => {
	config.user.id = uid;
	if (uid > 0) {
		EnterRoom();
	} else {
		makeToast('Login failed.');
	}
});

server.bind(net.RequestRoomId, room_id => {
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

server.bind(net.CreateRoom, room_id => {
	if (room_id > 0) {
		config.room.id = room_id;
	} else {
		makeToast('Failed to create a new room.');
	}
});

server.bind(net.SetUserList, players => {
	config.room.players = [];
	for(let uid of players){
		config.room.players.push({
			id: uid
		});
	}
	requestUpdateName();
});

function requestUpdateRoom(){
	let roles = [];
	config.room.roles.forEach(str => {
		roles.push(PlayerRole.convertToNum(str));
	});

	server.request(net.UpdateRoom, {
		roles: roles
	});
}

server.bind(net.EnterRoom, info => {
	if (info) {
		config.room.id = info['room_id'];
		config.room.owner.id = info['owner_id'];

		if (config.room.id > 0) {
			require('page/enter-room');
			if (config.room.owner.id == config.user.id) {
				requestUpdateRoom();
			}
		}
	} else {
		showMessage('');
		makeToast('The room doesn\'t exist.');
	}
});

server.bind(net.UpdateRoom, args => {
	if (args.roles instanceof Array) {
		config.room.roles = [];
		args.roles.forEach((num)=>{
			config.room.roles.push(PlayerRole.convertToString(num));
		});

		if(typeof updateRoles == 'function'){
			updateRoles();
		}
	}
});

server.bind(net.AddUser, uid => {
	if(!config.room.players.some((player)=>{player.id == uid})){
		let player = {
			id: uid
		};
		config.room.players.push(player);
		requestUpdateName(uid);
		if(typeof addPlayer == 'function'){
			addPlayer(player);
		}
	}
});

server.bind(net.RemoveUser, uid => {
	for (let i = 0; i < config.room.players.length; i++) {
		if(uid == config.room.players[i].id){
			config.room.players.splice(i, 1);
			if(typeof removePlayer == 'function'){
				removePlayer(uid);
			}
			break;
		}
	}
});

server.bind(net.UpdatePlayer, info => {
	var users = $('ul#player-list li');
	users.each(function(){
		var user = $(this);
		if(user.data('uid') != info.id){
			return true;
		}

		if(info.name){
			var nickname = user.children('.nickname');
			nickname.text(info.name);
		}

		return false;
	});

	config.room.players.forEach(player => {
		if(player.id == info.id){
			for (let prop in info){
				player[prop] = info[prop];
			}
		}
	});
});

server.bind(net.StartGame, ()=>{
	require('page/start-game');
});

server.bind(net.DeliverRoleCard, role => {
	role = PlayerRole.convertToString(role);
	config.user.role = role;
	if(typeof updateRole == 'function'){
		updateRole();
	}
});

server.bind(net.UpdatePhase, role => {
	var role_box = $('#current-role');
	if(role > 0){
		role = PlayerRole.convertToString(role);
		let card = $('<div class="role"></div>');
		card.addClass(role);
		role_box.html('');
		role_box.append(card);
	}else{
		role_box.html('Daytime~~');
		let button_area = $('#button-area');
		button_area.html('');

		let game_over_button = $('<button type="button">GAME OVER</button>');
		game_over_button.click(() => {
			server.request(net.EndGame);
		});
		button_area.append(game_over_button);
	}

	$('#prompt-box').html('');
});

function enableSelection(list, max_num){
	list.addClass('selectable');
	list.unbind('click');
	list.on('click', 'li', e => {
		var li = $(e.currentTarget);
		if(li.hasClass('selected')){
			li.removeClass('selected');
		}else{
			let selected = list.children('li.selected');
			if(selected.length < max_num){
				li.addClass('selected');
			}else if(max_num == 1){
				selected.removeClass('selected');
				li.addClass('selected');
			}
		}
	});
}

server.bind(net.ChoosePlayer, num => {
	var s = num > 1 ? 's' : '';
	$('#prompt-box').html(`Please select ${num} player${s}`);
	enableSelection($('#player-list'), num);
});

server.bind(net.ChoosePlayerOrCard, limit => {
	var s1 = limit.player > 1 ? 's' : '';
	var s2 = limit.card > 1 ? 's' : '';
	$('#prompt-box').html(`Please select ${limit.player} player${s1} or ${limit.card} card${s2}`);
	enableSelection($('#player-list'), limit.player);
	enableSelection($('#extra-card-list'), limit.card);

	$('#player-list').click(()=>{
		$('ul#extra-card-list > li').removeClass('selected');
	});
	$('#extra-card-list').click(()=>{
		$('ul#player-list > li').removeClass('selected');
	});
});

server.bind(net.ChooseCard, num => {
	var s = num > 1 ? 's' : '';
	$('#prompt-box').html(`Please select ${num} unused card${s}`);
	enableSelection($('#extra-card-list'), num);
});

function showPlayerRole(info){
	var player = config.room.findPlayer(info.uid);
	if(player == null){
		return;
	}
	var role = PlayerRole.convertToString(info.role);

	var players = $('ul#player-list > li');
	players.each(function(){
		var li = $(this);
		if (li.data('uid') == info.uid) {
			var role_text = li.children('.role-text');
			role_text.text(role.toUpperCase());
			return false;
		}
		return true;
	});
}

server.bind(net.ShowPlayerRole, showPlayerRole);

function showExtraCard(info){
	var extra_card_list = $('ul#extra-card-list > li');
	var li = extra_card_list.eq(info.id);
	if(li.length > 0){
		let card = li.children('.role');
		let role = PlayerRole.convertToString(info.role);
		card.removeClass('background');
		card.addClass(role);
	}
}

server.bind(net.ShowExtraCard, showExtraCard);

server.bind(net.EndGame, arg => {
	if (arg.players) {
		let players = Array.apply(null, arg.players);
		players.forEach(showPlayerRole);
	}
	if (arg.extra_cards) {
		let cards = arg.extra_cards;
		for (let i = 0; i < cards.length; i++) {
			showExtraCard({
				id: i,
				role: cards[i]
			});
		}
	}

	let button_area = $('#button-area');
	let return_button = $('<button type="button">RETURN</button>');
	return_button.click(() => {
		require('page/connect');
	});
	button_area.html('');
	button_area.append(return_button);
});
