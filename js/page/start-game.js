
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
	let confirm_button = $('<button type="button">CONFIRM</button>');
	button_area.append(confirm_button);

	confirm_button.click(()=>{
		let mode = 0;

		let cards = [];
		let extra_card_list = $('#extra-card-list.selectable');
		if(extra_card_list.length > 0){
			extra_card_list.unbind('click');
			mode |= 0x1;

			let selected = extra_card_list.children('li.selected');
			selected.each(function(){
				cards.push($(this).index());
			});

			selected.removeClass('selected');
			extra_card_list.removeClass('selectable');
		}

		let players = [];
		let player_list = $('#player-list.selectable');
		if(player_list.length > 0){
			player_list.unbind('click');
			mode |= 0x2;

			let selected = player_list.children('li.selected');
			selected.each(function(){
				players.push($(this).data('uid'));
			});

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
	});

	let infomation_box = $('<div class="box infomation-box"><h3>Current Phase</h3></div>');
	let role_content = $('<span id="current-role"></span>');
	infomation_box.append(role_content);
	let prompt_box = $('<div id="prompt-box" class="message-box"></div>');
	prompt_box.html('Darkness falls... Watch out when there\'s a full moon...');
	infomation_box.append(prompt_box);
	root.append(infomation_box);
});
