
DeclareModule('page/create-room', () => {
	var root = $('#root');
	root.html('');

	function add_role(selector, role, selected = false){
		let li = $('<li></li>');
		li.data('role', role);
		li.append(PlayerRole.createImage(role));
		if (selected) {
			li.addClass('selected');
		}
		selector.append(li);
	}

	var team_werewolf = $('<div class="box"><h3>Team Werewolf</h3></div>');

	var werewolf_selector = $('<ul></ul>');
	werewolf_selector.addClass('role-selector');
	for (let i = 0; i < 3; i++) {
		add_role(werewolf_selector, 'werewolf', i == 0);
	}
	team_werewolf.append(werewolf_selector);

	var minion_selector = $('<ul></ul>');
	minion_selector.addClass('role-selector');
	for (let i = 0; i < 2; i++) {
		add_role(minion_selector, 'minion');
	}
	team_werewolf.append(minion_selector);

	root.append(team_werewolf);

	var team_villager = $('<div class="box"><h3>Team Villager</h3></div>');

	var villager_selector = $('<ul></ul>');
	villager_selector.addClass('role-selector');
	for (let i = 0; i < 3; i++) {
		add_role(villager_selector, 'villager', i <= 1);
	}
	team_villager.append(villager_selector);

	var mason_selector = $('<ul></ul>');
	mason_selector.addClass('role-selector');
	for (let i = 0; i < 2; i++) {
		add_role(mason_selector, 'mason');
	}
	team_villager.append(mason_selector);

	var special_selector = $('<ul></ul>');
	special_selector.addClass('role-selector');
	var special_roles = [
		'doppelganger', 'robber', 'seer',
		'troublemaker', 'drunk', 'insomniac',
		'hunter'
	];
	for (let role of special_roles) {
		add_role(special_selector, role);
	}
	team_villager.append(special_selector);

	root.append(team_villager);

	var team_tanner = $('<div class="box"><h3>Team Tanner</h3></div>');
	var tanner_selector = $('<ul></ul>');
	tanner_selector.addClass('role-selector');
	add_role(tanner_selector, 'tanner');
	team_tanner.append(tanner_selector);
	root.append(team_tanner);

	var selection_result = $('<div class="inline-message"></div>');
	root.append(selection_result);

	var select_first_n = function () {
		var li = $(this);

		if (li.hasClass('selected')) {
			let prev = li.prev();
			if (prev.length > 0) {
				let next = li.next();
				if (next.length == 0 || !next.hasClass('selected')) {
					li.removeClass('selected');
					return;
				}
			}
		}

		li.addClass('selected');

		let prev = li.prev();
		while (prev.length > 0) {
			prev.addClass('selected');
			prev = prev.prev();
		}

		let next = li.next();
		while (next.length > 0) {
			next.removeClass('selected');
			next = next.next();
		}
	};

	[werewolf_selector, villager_selector].forEach(selector => {
		selector.on('click', 'li', select_first_n);
	});

	[special_selector, minion_selector, tanner_selector].forEach(selector => {
		selector.on('click', 'li', function(e){
			$(this).toggleClass('selected');
		});
	});

	mason_selector.on('click', () => {
		mason_selector.children('li').toggleClass('selected');
	});

	$('.role-selector').on('click', () => {
		var role_num = $('.role-selector > li.selected').length;
		var role_s = role_num > 1 ? 's' : '';
		var player_num = Math.max(0, role_num - 3);
		var player_s = player_num > 1 ? 's' : '';
		selection_result.text(`${role_num} role${role_s}, ${player_num} player${player_s}`);
	});

	var button_area = $('<div></div>');
	button_area.addClass('button-area');

	let return_button = $('<button type="button">RETURN</button>');
	return_button.click(() => {
		LoadPage('enter-lobby');
	});
	button_area.append(return_button);

	var create_button = $('<button></button>');
	create_button.attr('type', 'button');
	create_button.html('CREATE');
	create_button.click(()=>{
		var selected_roles = [];
		$('ul.role-selector li.selected').each(function(){
			selected_roles.push($(this).data('role'));
		});

		if (selected_roles.length < 4) {
			MakeToast('Please select at least 4 roles.');
			return;
		}

		$room.roles = selected_roles;
		$client.request(net.RequestRoomId);
	});
	button_area.append(create_button);

	root.append(button_area);
});
