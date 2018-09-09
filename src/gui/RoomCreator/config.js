
import Role from '../../game/Role';
import Team from '../../game/Team';

const config = new Map;

config.set(Team.Werewolf, [
	Role.Werewolf,
	Role.Werewolf,
	Role.Werewolf,
	Role.Minion,
	Role.Minion,
]);

config.set(Team.Villager, [
	Role.Villager,
	Role.Villager,
	Role.Villager,
	Role.Mason,
	Role.Mason,
	Role.Robber,
	Role.Seer,
	Role.Troublemaker,
	Role.Drunk,
	Role.Insomniac,
	Role.Hunter,
]);

config.set(Team.Other, [
	Role.Doppelganger,
	Role.Tanner,
]);

export default config;
