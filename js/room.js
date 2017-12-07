
class Room {

	constructor(){
		this.id = 0;
		this.owner = {
			id: 0
		};

		this.roles = [];
		this.players = [];
		this.extra_card_num = 3;
	}

	findPlayer(uid){
		for(let player of this.players){
			if(player.id == uid){
				return player;
			}
		}
		return null;
	}

}
