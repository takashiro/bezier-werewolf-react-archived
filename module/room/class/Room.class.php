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

class Room extends DBObject{

	const TABLE_NAME = 'room';

	public function __construct(int $id = 0){
		parent::__construct();

		if($id > 0){
			$this->fetch('*', 'id='.$id);
		}
	}

	public function addUser($user){
		if(is_numeric($user)){
			$user_id = $user;
		}elseif(is_array($user)){
			$user_id = $user['id'];
		}
		unset($user);

		global $db;
		$table = $db->select_table('roomuser');
		$table->insert(array(
			'room_id' => $this->id,
			'user_id' => $user_id,
		), false, 'IGNORE');
	}

}
