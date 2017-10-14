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

class SimpleUser extends DBObject{

	const TABLE_NAME = 'simpleuser';

	public function __construct(int $id = 0){
		parent::__construct();

		if($id == 0){
			empty($_COOKIE['userid']) || $id = intval($_COOKIE['userid']);
		}
		if($id > 0){
			$this->fetch('*', 'id='.$id);
		}
	}

	public function isLoggedIn(){
		return isset($this->id) && $this->id > 0;
	}

	public function login(){
		if($this->isLoggedIn()){
			rsetcookie('userid', $this->id);
		}
	}

	public function logout(){
		if($this->isLoggedIn()){
			$this->deleteFromDB();
			rsetcookie('userid');
		}
	}

}
