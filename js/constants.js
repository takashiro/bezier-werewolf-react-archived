
const net = DeclareCommand(
	'UpdatePlayer',
	'UpdatePhase',
	'ChoosePlayer',
	'ChoosePlayerOrCard',
	'ChooseCard',
	'ShowPlayerRole',
	'ShowExtraCard',
	'EndGame',

	'MaxLimit'
);

const PlayerRole = DeclareEnum(
	'Unknown',

	'Doppelganger',
	'Werewolf',
	'Minion',
	'Robber',
	'Mason',
	'Seer',
	'TroubleMaker',
	'Drunk',
	'Insomniac',
	'Hunter',
	'Villager',
	'Tanner',

	'MaxLimit'
);

(()=>{
	let num2str = {};
	let str2num = {};

	for (let role in PlayerRole) {
		let str = role.toLowerCase();
		let num = PlayerRole[role];
		str2num[str] = num;
		num2str[num] = str;
	}

	PlayerRole.convertToNum = str => {
		return str2num[str];
	};

	PlayerRole.convertToString = num => {
		return num2str[num];
	};

	PlayerRole.createImage = role => {
		return `<div class="role" style="background-image: url(style/role/${role}.jpg)"></div>`;
	};

})();
