
const $config = {
	room: new Room,
	user: {
		id: 0,
		name: ''
	}
};

function ShowMessage(message){
	$('#message-box').html(message);
}

$(()=>{
	ShowMessage('Loading dialogs...');
	LoadScript('page/login');
});
