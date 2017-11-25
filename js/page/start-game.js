
DeclareModule('page/start-game', () => {
	let root = $('#root');

	let role_box = $('#role-box');
	role_box.html('<h3>Your Role</h3>');
	var user_role = $('<div></div>');
	role_box.append(user_role);

	window.updateRole = ()=>{
		user_role.html('');
		var role_card = $('<div class="role"></div>');
		role_card.addClass($user.role);
		user_role.append(role_card);
	};

	let extra_card_box = $('#extra-card-box');
	extra_card_box.show();

	let button_area = $('#button-area');
	button_area.html('');
	var confirm_button = $('<button type="button">CONFIRM</button>');
	button_area.append(confirm_button);

	confirm_button.click(()=>{
		var mode = 0;

		var cards = [];
		var extra_card_list = $('#extra-card-list.selectable');
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

		var players = [];
		var player_list = $('#player-list.selectable');
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

	var infomation_box = $('<div class="infomation-box"></div>');
	var current_role = $('<div class="box current-role"><h3>Current Phase</h3></div>');
	var role_content = $('<span id="current-role"></span>');
	current_role.append(role_content);
	infomation_box.append(current_role);
	var prompt_box = $('<div id="prompt-box" class="message-box"></div>');
	infomation_box.append(prompt_box);
	var answer_box = $('<ul id="answer-box" class="message-box"></ul>');
	infomation_box.append(answer_box);
	root.append(infomation_box);
});
