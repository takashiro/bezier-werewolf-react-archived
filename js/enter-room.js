
var root = $('#root');
root.html('');

var role_box = $('<div class="box"><h3>Roles</h3></div>');
var role_list = $('<ul class="role-list"><ul>');
role_box.append(role_list);
root.append(role_box);

function updateRoles(){
	role_list.html('');
	config.room.roles.forEach((role)=>{
		var li = $(`<li><div class="role ${role}"></div></li>`);
		role_list.append(li);
	});
}
updateRoles();

var online_box = $('<div class="box"><h3>Players</h3></div>');
var online_list = $('<ul id="player-list" class="player-list"></ul>');
online_box.append(online_list);
root.append(online_box);

function addPlayer(id){
	var li = $('<li></li>');
	li.data('uid', id);
	li.html(id);
	online_list.append(li);
	return li;
}
addPlayer(config.user.id).html(config.user.name);
config.room.players.forEach(addPlayer);

function removePlayer(id){
	online_list.children().each(function(){
		var li = $(this);
		if(li.data('uid') == id){
			li.remove();
			return false;
		}
		return true;
	});
}
