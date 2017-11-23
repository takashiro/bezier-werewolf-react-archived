
$_MODULE['page/create-room'] = ()=>{
	var root = $('#root');
	root.html('');

	function add_role(selector, role, selected = false){
		let div = $('<div></div>');
		div.addClass('role');
		div.addClass(role);
		let li = $('<li></li>');
		li.data('role', role);
		li.append(div);
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
	add_role(minion_selector, 'minion');
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

	var select_first_n = function(){
		var li = $(this);
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
	[werewolf_selector, villager_selector].forEach((selector)=>{
		selector.on('click', 'li', select_first_n);
	});

	[special_selector, minion_selector, tanner_selector].forEach((selector) => {
		selector.on('click', 'li', function(e){
			$(this).toggleClass('selected');
		});
	});

	mason_selector.on('click', 'li', function(){
		mason_selector.children('li').toggleClass('selected');
	});

	var button_area = $('<div></div>');
	button_area.addClass('button-area');
	var create_button = $('<button></button>');
	create_button.attr('type', 'button');
	create_button.html('CREATE');
	button_area.append(create_button);
	root.append(button_area);

	create_button.click(()=>{
		var selected_roles = [];
		$('ul.role-selector li.selected').each(function(){
			selected_roles.push($(this).data('role'));
		});

		if (selected_roles.length < 4) {
			makeToast('Please select at least 4 roles.');
			return;
		}

		config.room.roles = selected_roles;
		server.request(net.RequestRoomId);
	});
};
