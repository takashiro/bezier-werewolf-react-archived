
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

var werewolf_selector = $('<ul></ul>');
werewolf_selector.addClass('role-selector');
for (let i = 0; i < 3; i++) {
	add_role(werewolf_selector, 'werewolf', i == 0);
}
root.append(werewolf_selector);

var villager_selector = $('<ul></ul>');
villager_selector.addClass('role-selector');
for (let i = 0; i < 3; i++) {
	add_role(villager_selector, 'villager', i <= 1);
}
root.append(villager_selector);

$('#werewolf-selector, #villager-selector').on('click', 'li', function(){
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
});

var special_selector = $('<ul></ul>');
special_selector.addClass('role-selector');
var special_roles = [
	'doppelganger', 'minion', 'robber',
	'mason', 'seer', 'troublemaker', 'drunk',
	'insomniac', 'hunter', 'tanner'
];
for (let role of special_roles) {
	add_role(special_selector, role);
}
root.append(special_selector);

special_selector.on('click', 'li', function(e){
	$(this).toggleClass('selected');
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

	if (selected_roles.length <= 0) {
		makeToast('Please select at least 4 roles.');
	} else {
		config.roles = selected_roles;
		server.request(net.RequestRoomId);
	}
});
