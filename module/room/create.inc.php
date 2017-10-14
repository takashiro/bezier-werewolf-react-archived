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

if(!$_POST){
	include view('create');
	exit;
}

if(empty($_POST['roles']) || count($_POST['roles']) < 4){
	showmsg('Please select at least 4 roles.');
}

$available_roles = array(
	'werewolf', 'villager',
	'doppelganger', 'minion', 'robber', 'mason', 'seer',
	'troublemaker', 'drunk', 'insomniac', 'hunter', 'tanner',
);

$roles = array();
$werewolf_num = 0;
$villager_num = 0;
foreach($_POST['roles'] as $role){
	if($role == 'villager'){
		$villager_num++;
		$roles[] = $role;
	}elseif($role == 'werewolf'){
		$werewolf_num++;
		$roles[] = $role;
	}elseif(in_array($role, $available_roles)){
		$roles[] = $role;
	}
}

if($werewolf_num < 1){
	showmsg('There should be at least one werewolf.');
}

if($villager_num < 1){
	showmsg('There should be at least one villager.');
}

if($roles){
	$table = $db->select_table('room');
	$table->insert(array(
		'roles' => implode(',', $roles),
	));
	$room_id = $table->insert_id();
	exit('{"room_id":'.$room_id.'}');
}else{
	showmsg('Illegal operation.');
}
