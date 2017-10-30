
const net = declareCommands(
	'DeliverRoleCard',
	'ChoosePlayer',
	'EndGame',

	'MaxLimit'
);

const PlayerRole = enums([
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
]);

(()=>{
	var num2str = {};
	var str2num = {};

	for (let role in PlayerRole) {
		let str = role.toLowerCase();
		let num = PlayerRole[role];
		str2num[str] = num;
		num2str[num] = str;
	}

	PlayerRole.convertToNum = (str)=>{
		return str2num[str];
	};

	PlayerRole.convertToString = (num)=>{
		return num2str[num];
	};
})();
