<?php

/***********************************************************************
One Night Ultimate Werewolf
Copyright (C) 2017  Kazuichi Takashiro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

takashiro@qq.com
************************************************************************/

if(!defined('S_ROOT')) exit('access denied');

if(empty($_GET['id'])) exit('access denied');

$id = intval($_GET['id']);
$room = new Room($id);
if(!$room->exists()){
	showmsg('The room does not exist.');
}

if($room->status == 0){
	$db->query("UPDATE {$tpre}room SET status=1 WHERE id={$room->id} AND status=0");
	if($db->affected_rows > 0){
		$roles = explode(',', $room->roles);
		shuffle($roles);
		$players = $room->getPlayers();
		foreach($players as $player){
			$role = each($roles);
			$db->query("UPDATE {$tpre}roomuser SET role='{$role[1]}' WHERE room_id={$room->id} AND user_id={$player['id']}");
		}
	}
}

$user = new SimpleUser;
if(!$user->isLoggedIn()){
	showmsg('You are not in this room.');
}

$role = $db->result_first("SELECT role FROM {$tpre}roomuser WHERE room_id={$room->id} AND user_id={$user->id}");

$players = $room->getPlayers();

include view('start');
