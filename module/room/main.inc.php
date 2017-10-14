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
	exit('The room does not exist.');
}

$user = new SimpleUser;
if($user->isLoggedIn()){
	$room->addPlayer($user->id);
}

$players = $db->fetch_all("SELECT r.user_id AS id, u.nickname
	FROM {$tpre}roomuser r
		LEFT JOIN {$tpre}simpleuser u ON u.id=r.user_id
	WHERE r.room_id=$id");

$room = $room->toReadable();
$room['roles'] = explode(',', $room['roles']);
$user = $user->toReadable();

include view('main');
