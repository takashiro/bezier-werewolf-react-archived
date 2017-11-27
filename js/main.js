
const $room = new Room;

const $user = {
	id: 0,
	name: ''
};

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
