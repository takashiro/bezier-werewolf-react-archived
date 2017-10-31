
role_box.html('<h3>Your Role</h3>');
var user_role = $('<div></div>');
role_box.append(user_role);

function updateRole(){
	user_role.html('');
	var role_card = $('<div class="role"></div>');
	role_card.addClass(config.user.role);
	user_role.append(role_card);
}

button_area.html('');
var confirm_button = $('<button type="button">CONFIRM</button>');
button_area.append(confirm_button);

confirm_button.click(()=>{
});
