DROP SCHEMA IF EXISTS Classical;
CREATE SCHEMA Classical;
USE Classical;

DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS Concert;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Performance;
DROP TABLE IF EXISTS Performance_post;

CREATE TABLE Piece(
	piece_id	INT AUTO_INCREMENT,
	composer 	VARCHAR(100),
	title 		VARCHAR(100),
	PRIMARY KEY (piece_id)
);

CREATE TABLE Venue(
    venue_id	INT,
    name		VARCHAR(100),
    address		VARCHAR(200),
    lattitude	FLOAT,
    longtitude	FLOAT,
    time_zone	TIME,
    PRIMARY KEY (venue_id)
);

CREATE TABLE Concert(
	concert_id 	INT AUTO_INCREMENT,
	title		VARCHAR(200),
	org			VARCHAR(100) NOT NULL,
	details		VARCHAR(1500),
	url			VARCHAR(500) NOT NULL,
	PRIMARY KEY (concert_id)
);


CREATE TABLE Comment(
    comment_id	INT,
    content		VARCHAR(1500) NOT NULL,
    rate		INT CHECK(rate >= 0 AND rate <= 5),
    PRIMARY KEY (comment_id)
);

CREATE TABLE Performance(
	perform_id	INT AUTO_INCREMENT,
	concert_id  INT,
	venue_id	INT,
	date_time	date,
	PRIMARY KEY (perform_id),
	FOREIGN KEY (concert_id) REFERENCES Concert(concert_id) ON DELETE CASCADE,
	FOREIGN KEY (venue_id) REFERENCES Venue(venue_id) ON DELETE SET NULL
);

CREATE TABLE Performance_post(
	perform_id	INT,
	comment_id	INT,
	PRIMARY KEY (perform_id,comment_id),
	FOREIGN KEY (perform_id) REFERENCES Performance(perform_id) ON DELETE CASCADE,
	FOREIGN KEY (comment_id) REFERENCES Comment(comment_id) ON DELETE CASCADE
);

