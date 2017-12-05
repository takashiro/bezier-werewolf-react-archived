
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
		let game_over_button = $('<button type="button">GAME OVER</button>');
		game_over_button.click(() => {
			$client.request(net.EndGame);
		});
		button_area.append(game_over_button);
	});

	confirm_button_area.on('enable-confirm', () => {
		confirm_button_area.addClass('enabled');
	});

	confirm_button_area.on('disable-confirm', () => {
		confirm_button_area.removeClass('enabled');
	});

	confirm_button.click(()=>{
		if (!$selection.enabled) {
			MakeToast('No action required now.');
			return;
		}

		if ($selection.submitted) {
			MakeToast('God has already received your answer.');
			return;
		}

		let mode = 0;

		let cards = [];
		if ($selection.card.max > 0) {
			mode |= 0x1;

			let extra_card_list = $('#extra-card-list.selectable');
			let selected = null;
			if (extra_card_list.length > 0) {
				selected = extra_card_list.children('li.selected');
				selected.each(function(){
					cards.push($(this).index());
				});
			}

			if (cards.length < $selection.card.min) {
				let s = $selection.card.min > 1 ? 's' : '';
				MakeToast(`You must select at least ${$selection.card.min} card${s}`);
				return;
			} else if (cards.length > $selection.card.max) {
				let s = $selection.card.min > 1 ? 's' : '';
				MakeToast(`You can select no more than ${$selection.card.max} card${s}`);
				return;
			}

			extra_card_list.unbind('click');
			selected.removeClass('selected');
			extra_card_list.removeClass('selectable');
		}

		let players = [];
		if ($selection.player.max > 0) {
			mode |= 0x2;

			let player_list = $('#player-list.selectable');
			let selected = null;
			if (player_list.length > 0) {
				selected = player_list.children('li.selected');
				selected.each(function(){
					players.push($(this).data('uid'));
				});
			}

			if (players.length < $selection.player.min) {
				let s = $selection.player.min > 1 ? 's' : '';
				MakeToast(`You must select at least ${$selection.player.min} player${s}`);
				return;
			} else if (players.length > $selection.player.max) {
				let s = $selection.player.min > 1 ? 's' : '';
				MakeToast(`You can select no more than ${$selection.player.max} player${s}`);
				return;
			}

			player_list.unbind('click');
			selected.removeClass('selected');
			player_list.removeClass('selectable');
		}

		if(mode == 1){
			$client.request(net.ChooseCard, cards);
		}else if(mode == 2){
			$client.request(net.ChoosePlayer, players);
		}else if(mode == 3){
			if(cards.length > 0){
				$client.request(net.ChoosePlayerOrCard, {
					type: 'card',
					targets: cards
				});
			}else{
				$client.request(net.ChoosePlayerOrCard, {
					type: 'player',
					targets: players
				});
			}
		}

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
