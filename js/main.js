
const config = {
	room: new Room,
	user: {
		id: 0,
		name: ''
	}
};

function showMessage(message){
	$('#message-box').html(message);
}

$(()=>{
	showMessage('Loading connection dialog...');
	require('page/connect');
});
