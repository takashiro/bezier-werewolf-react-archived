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

if(empty($_POST['room_id'])) showmsg('illegal operation');

$room_id = intval($_POST['room_id']);
if(!Room::Exist($room_id)){
	showmsg('The room does not exist anymore.');
}

$room = new Room;
$room->id = $room_id;

$user = new SimpleUser;
if($user->isLoggedIn()){
	$room->addUser($user->id);
}else{
	if(empty($_POST['nickname'])){
		showmsg('Please type a nickname.');
	}

	$nickname = htmlspecialchars(trim($_POST['nickname']));
	$nickname = substr($nickname, 0, 21);
	$user->nickname = $nickname;
	$user->insert();
	$user->login();

	$room->addUser($user->id);
}

showmsg('Welcome to the fantastic One Night Ultimate Werewolf!', 'refresh');
