
const $room = new Room;

const $user = {
	id: 0,
	name: ''
};

function ShowMessage(message){
	$('#message-box').html(message);
}

function LoadPage(page){
	LoadScript('page/' + page, () => {
		ShowMessage('');
	});
}

$(()=>{
	ShowMessage('Loading dialogs...');
	LoadPage('login');
});
