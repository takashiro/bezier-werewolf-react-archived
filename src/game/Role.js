import Enum from "../net/Enum";

const Role = new Enum(
	'Invalid',

	// Team Werewolf
	'Werewolf',
	'Minion',

	// Team Villager
	'Villager',
	'Mason',
	'Robber',
	'Seer',
	'Troublemaker',
	'Drunk',
	'Insomniac',
	'Hunter',

	// Others
	'Doppelganger',
	'Tanner',
);

export default Role;
