
const $client = new Client;

function RequestUpdateName(receiver){
	var arg = {
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

		if(typeof updateRoles == 'function'){
			updateRoles();
		}
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
	if(!$room.players.some((player)=>{player.id == uid})){
		let player = {
			id: uid
		};
		$room.players.push(player);
		RequestUpdateName(uid);
		if(typeof addPlayer == 'function'){
			addPlayer(player);
		}
	}
});

$client.bind(net.RemoveUser, uid => {
	for (let i = 0; i < $room.players.length; i++) {
		if(uid == $room.players[i].id){
			$room.players.splice(i, 1);
			if(typeof removePlayer == 'function'){
				removePlayer(uid);
			}
			break;
		}
	}
});

$client.bind(net.UpdatePlayer, info => {
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

	$room.players.forEach(player => {
		if(player.id == info.id){
			for (let prop in info){
				player[prop] = info[prop];
			}
		}
	});
});

$client.bind(net.StartGame, ()=>{
	ShowMessage('Loading...');
	LoadPage('start-game');
});

$client.bind(net.DeliverRoleCard, role => {
	role = PlayerRole.convertToString(role);
	$user.role = role;
	$('#my-role').trigger('updated');
});

$client.bind(net.UpdatePhase, role => {
	var role_box = $('#current-role');
	if(role > 0){
		role = PlayerRole.convertToString(role);
		role_box.html(PlayerRole.createImage(role));
	}else{
		role_box.html('Daytime~~');
		let button_area = $('#button-area');
		button_area.html('');

		let game_over_button = $('<button type="button">GAME OVER</button>');
		game_over_button.click(() => {
			$client.request(net.EndGame);
		});
		button_area.append(game_over_button);
	}

	$('#prompt-box').html('');
});

function EnableSelector(list, max_num){
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

$client.bind(net.ChoosePlayer, num => {
	var s = num > 1 ? 's' : '';
	$('#prompt-box').html(`Please select ${num} player${s}`);
	EnableSelector($('#player-list'), num);
});

$client.bind(net.ChoosePlayerOrCard, limit => {
	var s1 = limit.player > 1 ? 's' : '';
	var s2 = limit.card > 1 ? 's' : '';
	$('#prompt-box').html(`Please select ${limit.player} player${s1} or ${limit.card} card${s2}`);
	EnableSelector($('#player-list'), limit.player);
	EnableSelector($('#extra-card-list'), limit.card);

	$('#player-list').click(()=>{
		$('ul#extra-card-list > li').removeClass('selected');
	});
	$('#extra-card-list').click(()=>{
		$('ul#player-list > li').removeClass('selected');
	});
});

$client.bind(net.ChooseCard, num => {
	var s = num > 1 ? 's' : '';
	$('#prompt-box').html(`Please select ${num} unused card${s}`);
	EnableSelector($('#extra-card-list'), num);
});

function ShowPlayerRole(info){
	var player = $room.findPlayer(info.uid);
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

$client.bind(net.ShowPlayerRole, ShowPlayerRole);

function ShowExtraCard(info){
	var extra_card_list = $('ul#extra-card-list > li');
	var li = extra_card_list.eq(info.id);
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
		$client.request(net.EnterRoom);
		LoadPage('enter-lobby');
	});
	button_area.html('');
	button_area.append(return_button);
});
