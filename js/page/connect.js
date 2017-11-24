
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

	let create_dialog = $('<div class="form-dialog"></div>');

	let create_button = $('<button type="button">CREATE</button>');
	create_dialog.append(create_button);

	root.append(create_dialog);

	let join_dialog = $('<div class="form-dialog"></div>');

	let room_input = $('<input type="text" placeholder="Room ID"></input>');
	join_dialog.append(room_input);

	let join_button = $('<button type="button">JOIN</button>');
	join_dialog.append(join_button);

	root.append(join_dialog);

	let connect_server = ()=>{
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
