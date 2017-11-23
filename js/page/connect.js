
(()=>{
	let connected = false;

	server.on('open', ()=>{
		connected = true;
		if (!config.user.id) {
			server.request(net.RequestUserId);
		} else {
			EnterRoom();
		}
	});

	server.on('close', ()=>{
		if (!connected) {
			showMessage('Failed to establish a connection to ' + server.url);
		} else {
			showMessage('Connection lost.');
		}
	});
})();

$_MODULE['page/connect'] = ()=>{
	let root = $('#root');
	root.html('');

	let message_box = $('<div id="message-box" class="inline-message"></div>');
	root.append(message_box);

	let dialog = $('<div class="form-dialog"></div>');

	let nickname_input = $('<input type="text" placeholder="Your name"></input>');
	let nickname = window.localStorage.getItem('nickname');
	if(nickname){
		nickname_input.val(nickname);
	}
	dialog.append(nickname_input);

	let room_input = $('<input type="text" placeholder="Room ID"></input>');
	dialog.append(room_input);

	let join_button = $('<button type="button">JOIN</button>');
	dialog.append(join_button);

	let create_button = $('<button type="button">CREATE</button>');
	dialog.append(create_button);

	root.append(dialog);

	let connect_server = ()=>{
		let nickname = nickname_input.val();
		if (nickname.length <= 0) {
			makeToast('Please type your nickname.');
			return;
		}

		config.user.name = nickname;

		message_box.html('Connecting...');
		if (server.connected) {
			EnterRoom();
		} else {
			if ($_GET['server']) {
				server.connect($_GET['server']);
			} else {
				let match = location.href.match(/^(\w+)\:\/\/(.*?)(?:\/.*)?$/i);
				if (match) {
					if (match[1] == 'file') {
						server.connect('localhost');
					} else {
						server.connect(match[2]);
					}
				}
			}
		}
	};

	join_button.click(()=>{
		var room_id = parseInt(room_input.val(), 10);
		if (isNaN(room_id)) {
			makeToast('It is not a number...');
			room_input.val('');
			room_input.focus();
			return;
		}

		$_GET['room_id'] = room_id;
		connect_server();
	});

	create_button.click(()=>{
		$_GET['room_id'] = 0;
		connect_server();
	});
};
