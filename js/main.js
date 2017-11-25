
const $room = new Room;

const $user = {
	id: 0,
	name: ''
};

function ShowMessage(message){
	$('#message-box').html(message);
}

$(()=>{
	ShowMessage('Loading dialogs...');
	LoadScript('page/login');
});
