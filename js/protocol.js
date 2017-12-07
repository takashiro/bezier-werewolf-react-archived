
const $client = new Client;

function RequestUpdateName(receiver){
	let arg = {
		info: {
			name: $user.name
		}
	};
	if (typeof receiver != 'undefined') {
		arg.receiver = receiver;
	}
	$client.request(net.UpdatePlayer, arg);
}

$client.bind(net.RequestUserId, user_id => {
	$user.id = user_id;
	$client.request(net.Login, {
		uid: user_id
	});

	window.localStorage.setItem('nickname', $user.name);
});

$client.bind(net.Login, uid => {
	$user.id = uid;
	if (uid > 0) {
		LoadPage('enter-lobby');
	} else {
		MakeToast('Login failed.');
	}
});

$client.bind(net.RequestRoomId, room_id => {
	if (room_id > 0) {
		$room.id = room_id;
		$client.request(net.CreateRoom, {
			id: room_id,
			game: 'onenightwerewolf'
		});
	} else {
		MakeToast('Failed to create a new room. Server is too busy.');
	}
});

$client.bind(net.CreateRoom, room_id => {
	if (room_id > 0) {
		$room.id = room_id;
	} else {
		MakeToast('Failed to create a new room.');
	}
});

$client.bind(net.SetUserList, players => {
	$room.players = [];
	for(let uid of players){
		$room.players.push({
			id: uid
		});
	}
	RequestUpdateName();
});

function requestUpdateRoom(){
	let roles = [];
	$room.roles.forEach(str => {
		roles.push(PlayerRole.convertToNum(str));
	});

	$client.request(net.UpdateRoom, {
		roles: roles
	});
}

$client.bind(net.EnterRoom, info => {
	if (info) {
		$room.id = info['room_id'];
		$room.owner.id = info['owner_id'];

		if ($room.id > 0) {
			LoadPage('enter-room');
			if ($room.owner.id == $user.id) {
				requestUpdateRoom();
			}
		}
	} else {
		ShowMessage('');
		MakeToast('The room doesn\'t exist.');
	}
});

$client.bind(net.UpdateRoom, args => {
	if (args.roles instanceof Array) {
		$room.roles = [];
		args.roles.forEach((num)=>{
			$room.roles.push(PlayerRole.convertToString(num));
		});

		$('.role-list').trigger('update-role');
	}

	if (args.extra_card_num) {
		$room.extra_card_num = args.extra_card_num;
		$('#extra-card-list').trigger('update-card');
	}

	if (args.owner_id) {
		let owner_id = parseInt(args.owner_id, 10);
		if (!isNaN(owner_id) && owner_id > 0) {
			$room.owner.id = owner_id;
			if (owner_id == $user.id) {
				$('.button-area .owner-button').show();
			} else {
				$('.button-area .owner-button').hide();
			}
		}
	}
});

$client.bind(net.AddUser, uid => {
	if(!$room.players.some(player => {player.id == uid})){
		let player = {
			id: uid
		};
		$room.players.push(player);
		$('.player-list').trigger('add-player', [player]);
		RequestUpdateName(uid);
	}
});

$client.bind(net.RemoveUser, uid => {
	for (let i = 0; i < $room.players.length; i++) {
		if(uid == $room.players[i].id){
			$room.players.splice(i, 1);
			$('.player-list').trigger('remove-player', [uid]);
			break;
		}
	}
});

$client.bind(net.UpdatePlayer, info => {
	$room.players.forEach(player => {
		if(player.id == info.id){
			for (let prop in info){
				player[prop] = info[prop];
			}
			$('.player-list').trigger('update-player', [info]);
		}
	});
});

$client.bind(net.StartGame, ()=>{
	ShowMessage('Loading...');
	LoadPage('start-game');
});

$client.bind(net.UpdatePhase, role => {
	let role_box = $('#current-role');
	if(role > 0){
		$selection.enabled = false;
		role = PlayerRole.convertToString(role);
		role_box.html(PlayerRole.createImage(role));
	}else{
		role_box.html('Daytime~~');
		$('#button-area').trigger('game-over');
	}

	$('#prompt-box').html('');
});

function EnableSelector(list, max_num){
	list.addClass('selectable');
	list.unbind('click');
	list.on('click', 'li', e => {
		let li = $(e.currentTarget);
		if (li.hasClass('disabled')) {
			return;
		}

		if (li.hasClass('selected')) {
			li.removeClass('selected');
		} else {
			let selected = list.children('li.selected');
			if (selected.length < max_num) {
				li.addClass('selected');
			} else if(max_num == 1) {
				selected.removeClass('selected');
				li.addClass('selected');
			}
		}
	});
}

function DisableOption(list, condition) {
	list.children().each(function(){
		let li = $(this);
		if (condition(li)) {
			li.addClass('disabled');
		} else {
			li.removeClass('disabled');
		}
	});
}

$client.bind(net.ChoosePlayer, limit => {
	let s = limit.num > 1 ? 's' : '';
	let prompt = `Please select ${limit.num} player${s}`;
	if (limit.exclude_self) {
		prompt += ' (except yourself)';
	}
	$('#prompt-box').html(prompt);

	$selection.command = net.ChoosePlayer;
	$selection.enabled = true;
	$selection.submitted = false;
	$selection.player.min = limit.num;
	$selection.player.max = limit.num;
	$selection.card.min = 0;
	$selection.card.max = 0;

	let player_list = $('#player-list');
	if (limit.exclude_self) {
		DisableOption(player_list, li => li.data('uid') == $user.id);
	}
	EnableSelector(player_list, limit.num);
	$('#confirm-button-area').trigger('enable-confirm');
});

$client.bind(net.ChoosePlayerOrCard, limit => {
	let s1 = limit.player_num > 1 ? 's' : '';
	let s2 = limit.card_num > 1 ? 's' : '';
	let except = limit.exclude_self ? ' (except yourself)' : '';
	$('#prompt-box').html(`Please select ${limit.player_num} player${s1}${except} or ${limit.card_num} card${s2}`);

	$selection.command = net.ChoosePlayerOrCard;
	$selection.enabled = true;
	$selection.submitted = false;

	let player_list = $('#player-list');
	if (limit.exclude_self) {
		DisableOption(player_list, li => li.data('uid') == $user.id);
	}
	EnableSelector(player_list, limit.player_num);
	$selection.player.min = limit.player_num;
	$selection.player.max = limit.player_num;

	EnableSelector($('#extra-card-list'), limit.card_num);
	$selection.card.min = limit.card_num;
	$selection.card.max = limit.card_num;

	$('#player-list').click(() => {
		$('ul#extra-card-list > li').removeClass('selected');
		$selection.reply = net.ChoosePlayer;
	});
	$('#extra-card-list').click(() => {
		$('ul#player-list > li').removeClass('selected');
		$selection.reply = net.ChooseCard;
	});

	$('#confirm-button-area').trigger('enable-confirm');
});

$client.bind(net.ChooseCard, num => {
	let s = num > 1 ? 's' : '';
	$('#prompt-box').html(`Please select ${num} unused card${s}`);

	$selection.command = net.ChooseCard;
	$selection.enabled = true;
	$selection.submitted = false;
	$selection.player.min = 0;
	$selection.player.max = 0;
	$selection.card.min = num;
	$selection.card.max = num;

	EnableSelector($('#extra-card-list'), num);
	$('#confirm-button-area').trigger('enable-confirm');
});

function ShowPlayerRole(info){
	let player = $room.findPlayer(info.uid);
	if(player == null){
		return;
	}
	let role = PlayerRole.convertToString(info.role);

	let players = $('ul#player-list > li');
	players.each(function(){
		let li = $(this);
		if (li.data('uid') == info.uid) {
			let role_text = li.children('.role-text');
			role_text.text(role.toUpperCase());
			return false;
		}
		return true;
	});

	if (info.uid == $user.id) {
		$user.role = role;
		$('#my-role').trigger('update-role');
	}
}

$client.bind(net.ShowPlayerRole, ShowPlayerRole);

function ShowExtraCard(info){
	let extra_card_list = $('ul#extra-card-list > li');
	let li = extra_card_list.eq(info.id);
	if(li.length > 0){
		let role = PlayerRole.convertToString(info.role);
		li.html(PlayerRole.createImage(role));
	}
}

$client.bind(net.ShowExtraCard, ShowExtraCard);

$client.bind(net.EndGame, arg => {
	if (arg.players) {
		let players = Array.apply(null, arg.players);
		players.forEach(ShowPlayerRole);
	}
	if (arg.extra_cards) {
		let cards = arg.extra_cards;
		for (let i = 0; i < cards.length; i++) {
			ShowExtraCard({
				id: i,
				role: cards[i]
			});
		}
	}

	let button_area = $('#button-area');
	let return_button = $('<button type="button">RETURN</button>');
	return_button.click(() => {
		if ($client.connected) {
			$client.request(net.EnterRoom);
			LoadPage('enter-lobby');
		} else {
			LoadPage('login');
		}
	});
	button_area.html('');
	button_area.append(return_button);
});
