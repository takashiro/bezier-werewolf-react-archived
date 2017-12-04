
(()=>{
	let connected = false;

	$client.on('open', ()=>{
		connected = true;
		ShowMessage('Connection established. Logging in...');
		if (!$user.id) {
			$client.request(net.RequestUserId);
		} else {
			$client.request(net.Login, {
				uid: $user.id
			});
		}
	});

	$client.on('close', ()=>{
		if (!connected) {
			ShowMessage('Failed to establish a connection to ' + $client.url);
		} else {
			ShowMessage('Connection lost.');
		}
	});
})();

function ConnectServer(){
	ShowMessage('Connecting...');
	if ($client.connected && $user.id > 0) {
		LoadPage('enter-lobby');
	} else {
		try {
			if ($_GET['server']) {
				$client.connect($_GET['server']);
			} else {
				let match = location.href.match(/^(\w+)\:\/\/(.*?)(?:\/.*)?$/i);
				if (match) {
					if (match[1] == 'file') {
						$client.connect('localhost');
					} else {
						$client.connect(match[2]);
					}
				}
			}
		} catch (e) {
			ShowMessage(e.toString());
		}
	}
};

DeclareModule('page/login', () => {
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
			MakeToast('Please fill in your nickname.');
			name_input.focus();
			return;
		}

		nickname = nickname.substr(0, 15);
		$user.name = nickname;
		ConnectServer();
	});
});
