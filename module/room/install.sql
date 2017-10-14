
CREATE TABLE `pre_room` (
	`id` mediumint(8) unsigned auto_increment,
	`roles` text NOT NULL,
	PRIMARY KEY(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `pre_simpleuser` (
	`id` mediumint(8) unsigned auto_increment,
	`nickname` text NOT NULL,
	PRIMARY KEY(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `pre_roomuser` (
	`room_id` mediumint(8) unsigned NOT NULL,
	`user_id` mediumint(8) unsigned NOT NULL,
	`role` varchar(50) NULL,
	UNIQUE KEY `user` (`room_id`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
