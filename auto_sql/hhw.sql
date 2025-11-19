create table hhw
(
    `name` varchar(64) comment '存储器名',
    `ext` varchar(64) comment '描述',
    `text` text comment '存储过程',
    primary key (`name`)
) DEFAULT CHARSET=utf8 comment='存储过程';  