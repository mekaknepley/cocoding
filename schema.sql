CREATE DATABASE cocoders_db;

USE cocoders_db;

CREATE TABLE users (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  password char(60) NOT NULL,
  providerid char(60),
  provider char(60) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE rooms (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  sessionId varchar(255) NOT NULL,
  PRIMARY KEY (id)
);