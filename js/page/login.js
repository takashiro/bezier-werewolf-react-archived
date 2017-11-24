
$_MODULE['page/login'] = ()=>{
	let root = $('#root');
	root.html('');

	let dialog = $('<div class="form-dialog"></div>');

	let name_input = $('<input type="text" placeholder="Your Name"></input>');
	let nickname = window.localStorage.getItem('nickname');
	if(nickname){
		name_input.val(nickname);
	}
	dialog.append(name_input);

	let login_button = $('<button type="button">LOGIN</button>');
	dialog.append(login_button);

	root.append(dialog);

	login_button.click(()=>{
		let nickname = name_input.val();
		if (nickname.length <= 0) {
			makeToast('Please fill in your nickname.');
			name_input.focus();
			return;
		}

		nickname = nickname.substr(0, 8);
		config.user.name = nickname;
		loadscript('page/connect');
	});
};
