
DeclareModule('page/start-game', () => {
	let root = $('#root');

	let room_box = $('#room-box');
	room_box[0].className = 'box';
	room_box.html('Room No.' + $room.id);

	let role_box = $('#role-box');
	role_box.html('<h3>Your Role</h3>');
	let user_role = $('<div id="my-role"></div>');
	user_role.on('update-role', () => {
		if ($user.role) {
			user_role.html(PlayerRole.createImage($user.role));
		} else {
			user_role.html('<div class="role background"></div>');
		}
	});
	user_role.trigger('update-role');
	role_box.append(user_role);

	let extra_card_box = $('#extra-card-box');
	extra_card_box.show();

	let button_area = $('#button-area');
	button_area.html('');

	let confirm_button_area = $('<div id="confirm-button-area"></div>');
	let confirm_button = $('<button type="button">CONFIRM</button>');
	confirm_button_area.append(confirm_button);
	let waiting_message = $('<span class="inline-message"></span>');
	waiting_message.html('Waiting...');
	confirm_button_area.append(waiting_message);
	button_area.append(confirm_button_area);

	button_area.one('game-over', () => {
		button_area.html('');
		if ($room.owner.id == $user.id) {
			let reveal_all_button = $('<button type="button">REVEAL ALL</button>');
			reveal_all_button.click(() => {
				$client.request(net.EndGame);
			});
			button_area.append(reveal_all_button);
		} else {
			let message = $('<div class="inline-message"></div>');
			message.html('Free talk~');
			button_area.append(message);
		}
	});

	confirm_button_area.on('enable-confirm', () => {
		confirm_button_area.addClass('enabled');
	});

	confirm_button_area.on('disable-confirm', () => {
		confirm_button_area.removeClass('enabled');
	});

	let parse_selected_card = limit => {
		let cards = [];

		let extra_card_list = $('#extra-card-list.selectable');
		let selected = extra_card_list.children('li.selected');
		selected.each(function(){
			cards.push($(this).index());
		});

		if (cards.length < limit.min) {
			let s = limit.min > 1 ? 's' : '';
			MakeToast(`You must select at least ${limit.min} card${s}`);
			return;
		} else if (cards.length > limit.max) {
			let s = limit.min > 1 ? 's' : '';
			MakeToast(`You can select no more than ${limit.max} card${s}`);
			return;
		}

		return cards;
	};

	let parse_selected_player = limit => {
		let players = [];

		let player_list = $('#player-list.selectable');
		let selected = player_list.children('li.selected');
		selected.each(function(){
			players.push($(this).data('uid'));
		});

		if (players.length < limit.min) {
			let s = limit.min > 1 ? 's' : '';
			MakeToast(`You must select at least ${limit.min} player${s}`);
			return;
		} else if (players.length > limit.max) {
			let s = limit.min > 1 ? 's' : '';
			MakeToast(`You can select no more than ${limit.max} player${s}`);
			return;
		}

		return players;
	};

	confirm_button.click(()=>{
		if (!$selection.enabled) {
			MakeToast('No action required now.');
			return;
		}

		if ($selection.submitted) {
			MakeToast('God has already received your answer.');
			return;
		}

		switch ($selection.command) {
		case net.ChooseCard:
			let cards = parse_selected_card($selection.card);
			if (!cards) {
				return;
			}
			$client.request(net.ChooseCard, cards);
			break;
		case net.ChoosePlayer:
			let players = parse_selected_player($selection.player);
			if (!players) {
				return;
			}
			$client.request(net.ChoosePlayer, players);
			break;
		case net.ChoosePlayerOrCard:
			switch ($selection.reply) {
			case net.ChoosePlayer:
				let players = parse_selected_player($selection.player);
				if (!players) {
					return;
				}
				$client.request(net.ChoosePlayerOrCard, {
					type: 'player',
					targets: players
				});
				break;
			case net.ChooseCard:
				let cards = parse_selected_card($selection.card);
				if (!cards) {
					return;
				}
				$client.request(net.ChoosePlayerOrCard, {
					type: 'card',
					targets: cards
				});
				break;
			default:
				MakeToast('Please choose players or cards.');
				return;
			}
			break;
		default:
			MakeToast('Unknown server command.');
			return;
		}

		let extra_card_list = $('#extra-card-list');
		extra_card_list.unbind('click');
		extra_card_list.removeClass('selectable');

		let extra_cards = extra_card_list.children();
		extra_cards.removeClass('selected');
		extra_cards.removeClass('disabled');

		let player_list = $('#player-list');
		player_list.unbind('click');
		player_list.removeClass('selectable');

		let players = player_list.children();
		players.removeClass('selected');
		players.removeClass('disabled');

		$selection.submitted = true;
		confirm_button_area.trigger('disable-confirm');
		MakeToast(`Done!`);
	});

	let infomation_box = $('<div class="box infomation-box"><h3>Current Phase</h3></div>');
	let role_content = $('<span id="current-role"></span>');
	infomation_box.append(role_content);
	let prompt_box = $('<div id="prompt-box" class="message-box"></div>');
	prompt_box.html('Darkness falls... Watch out when there\'s a full moon...');
	infomation_box.append(prompt_box);
	root.append(infomation_box);
});
