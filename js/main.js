
const $room = new Room;

const $user = {
	id: 0,
	name: ''
};

const $selection = {
	enabled: false,
	submitted: false,
	player: {
		min: 0,
		max: 0
	},
	card: {
		min: 0,
		max: 0
	}
};

ScriptLoader = document.getElementById('script-loader');

function ShowMessage(message){
	$('#message-box').html(message);
}

function LoadPage(page){
	ShowMessage('Loading...');
	LoadScript('page/' + page, () => {
		ShowMessage('');
	});
}

LoadPage('login');
