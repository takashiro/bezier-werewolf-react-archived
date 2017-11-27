
DeclareModule('page/enter-lobby', () => {
	let root = $('#root');
	root.html('');

	let create_dialog = $('<div class="form-dialog"></div>');

	let create_prompt = $('<div class="inline-message"></div>');
	create_prompt.html('Create a new room');
	create_dialog.append(create_prompt);

	let create_button = $('<button type="button">CREATE</button>');
	create_dialog.append(create_button);

	root.append(create_dialog);

	root.append('<div class="space-line"></div>');

	let join_dialog = $('<div class="form-dialog"></div>');

	let join_prompt = $('<div class="inline-message"></div>');
	join_prompt.html('Or join an existing room');
	join_dialog.append(join_prompt);

	let room_input = $('<input type="number" placeholder="Room Number"></input>');
	join_dialog.append(room_input);

	let join_button = $('<button type="button">JOIN</button>');
	join_dialog.append(join_button);

	root.append(join_dialog);

	join_button.click(()=>{
		var room_id = parseInt(room_input.val(), 10);
		if (isNaN(room_id)) {
			MakeToast('It is not a number...');
			room_input.val('');
			room_input.focus();
			return;
		}

		$client.request(net.EnterRoom, {
			id: room_id,
			game: 'onenightwerewolf'
		});
	});

	create_button.click(()=>{
		LoadPage('create-room');
	});
});
