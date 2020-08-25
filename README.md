# Chirper-App
This project is a starting point for a TypeScript based React app that also has a local API server using express.

There are 2 different Webpack configurations. One for the server and one for the client.

##Configurations

#### ***Privileges***
create user 'chirprapp'@'localhost' identified by '(your password goes here)';<br />
grant all privileges on chirpr.* to 'chirprapp'@'localhost';


## DDLs

#### ***Users Table***
CREATE TABLE `users` (<br />
  `id` int(11) NOT NULL AUTO_INCREMENT,<br />
  `name` varchar(50) NOT NULL DEFAULT ' ',<br />
  `_created` datetime DEFAULT CURRENT_TIMESTAMP,<br />
  PRIMARY KEY (`id`),<br />
  UNIQUE KEY `name_UNIQUE` (`name`)<br />
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1<br /><br />
---
#### ***Chirps Table***
CREATE TABLE `chirps` (<br/>
  `id` int(11) NOT NULL AUTO_INCREMENT,<br/>
  `content` text NOT NULL,<br/>
  `title` varchar(40) NOT NULL,<br/>
  `img_src` text,<br/>
  `_created` text NOT NULL,<br/>
  PRIMARY KEY (`id`),<br/>
  FULLTEXT KEY `content` (`content`)<br/>
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1<br/><br/>
---
#### ***Mentions Table***
CREATE TABLE `mentions` (<br/>
  `userid` int(11) NOT NULL,<br/>
  `chirpid` int(11) NOT NULL,<br/>
  PRIMARY KEY (`userid`,`chirpid`),<br/>
  KEY `fk_mentionschirper` (`chirpid`),<br/>
  CONSTRAINT `fk_mentionschirper` FOREIGN KEY (`chirpid`) REFERENCES `chirps` (`id`),<br/>
  CONSTRAINT `fk_mentionsuser` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)<br/>
) ENGINE=InnoDB DEFAULT CHARSET=latin1<br/><br/>

## Stored Procedures
#### ***spUserMentions***
DELIMITER //<br/>
CREATE PROCEDURE spUserMentions(userid varchar(50))<br/>
BEGIN<br/>
	 &ensp; &ensp; &ensp; &ensp;DECLARE row_counts int default 0;<br/>
	&ensp; &ensp; &ensp; &ensp;SELECT COUNT(*) INTO row_counts  FROM chirpr.users <br/>
	&ensp; &ensp; &ensp; &ensp;WHERE users.name REGEXP LCASE(CONCAT('[[:<:]]', userid, '[[:>:]]'));<br/><br/>
     &ensp; &ensp; &ensp; &ensp;IF (row_counts = 1) THEN<br/>
		 &ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;SELECT *  FROM chirpr.chirps<br />
		&ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;WHERE LCASE(chirps.content) REGEXP<br />
		 &ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;LCASE(CONCAT('@','[[:<:]]', userid, '[[:>:]]'));<br/><br/>
   &ensp; &ensp; &ensp; &ensp;END IF; <br/>
END //<br/>
DELIMITER ;<br/><br/>
---
#### ***spMentionsCleanUp***
DELIMITER //<br/>
CREATE PROCEDURE spMentionsCleanUp()<br/>
BEGIN<br/>
	 &ensp; &ensp; &ensp; &ensp;DECLARE done BOOLEAN DEFAULT 0;<br/>
	 &ensp; &ensp; &ensp; &ensp;DECLARE my_userid int default 0; <br/>
     &ensp; &ensp; &ensp; &ensp;DECLARE my_user int default 0;<br/>
     &ensp; &ensp; &ensp; &ensp;DECLARE user_loop CURSOR FOR SELECT id FROM chirpr.users;<br/>
	&ensp; &ensp; &ensp; &ensp;DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done=1;<br/>
	&ensp; &ensp; &ensp; &ensp;OPEN user_loop;<br/>
    &ensp; &ensp; &ensp; &ensp; REPEAT<br/>
		&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;FETCH user_loop INTO my_userid;<br/>
       &ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp; SELECT COUNT(*) INTO my_user FROM chirpr.mentions <br/>
       &ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp; WHERE mentions.userid = my_userid;<br/><br/>
        &ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;IF (my_user = 0) THEN<br/>
			&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;DELETE FROM chirpr.users WHERE users.id = my_userid;<br/>
        &ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;END IF;<br/>
		&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;UNTIL done END REPEAT;<br/>
	&ensp; &ensp; &ensp; &ensp;CLOSE user_loop;<br/>
END //<br/>
DELIMITER ;<br/><br/>
---
#### ***spMentionsInstanceDelete***
DELIMITER //<br/>
CREATE PROCEDURE spMentionsInstanceDelete(my_chirpid int)<br/>
BEGIN<br/>
&ensp; &ensp; &ensp; &ensp;DECLARE done BOOLEAN DEFAULT 0;<br/>
&ensp; &ensp; &ensp; &ensp;declare count INT DEFAULT  0;<br/>
&ensp; &ensp; &ensp; &ensp;DECLARE my_userid INT DEFAULT NULL;<br/>
&ensp; &ensp; &ensp; &ensp;DECLARE my_username varchar(50) default '';<br/>
&ensp; &ensp; &ensp; &ensp;DECLARE row_counts int default 0;<br/>
&ensp; &ensp; &ensp; &ensp;DECLARE my_chirp CURSOR FOR SELECT m.userid FROM chirpr.chirps c<br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;JOIN chirpr.mentions m ON m.chirpid = c.id<br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;WHERE m.chirpid = my_chirpid;<br/><br/>
&ensp; &ensp; &ensp; &ensp;DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done=1;<br/>
&ensp; &ensp; &ensp; &ensp;OPEN my_chirp;<br/>
&ensp; &ensp; &ensp; &ensp;REPEAT<br/>
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;FETCH my_chirp INTO my_userid;<br/><br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;IF (my_userid IS NOT NULL) THEN<br/><br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;SELECT name INTO my_username FROM chirpr.users<br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;WHERE users.id = my_userid;<br/><br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;SELECT COUNT(*) INTO row_counts FROM chirpr.chirps<br/>
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;WHERE chirps.content REGEXP<br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;CONCAT('@','[[:<:]]',my_username,'[[:>:]]')<br/>
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp;AND chirps.id = my_chirpid;<br/><br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;IF (row_counts = 0) THEN<br/><br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;DELETE FROM chirpr.mentions<br/>
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;WHERE mentions.userid = my_userid<br/>
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;AND mentions.chirpid = my_chirpid;<br/><br />
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;END IF;<br/>
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;END IF;<br/>
&ensp; &ensp; &ensp; &ensp;&ensp; &ensp; &ensp; &ensp;UNTIL done END REPEAT;<br/>
&ensp; &ensp; &ensp; &ensp;CLOSE my_chirp;<br/>
END //<br/>
DELIMITER ;<br/><br/>
---
#### ***spMentionsInstanceUpdate***
DELIMITER //<br/>
CREATE PROCEDURE spMentionsInstanceUpdate(my_username varchar(50))<br/>
BEGIN<br/>
&ensp; &ensp; &ensp;&ensp;DECLARE done BOOLEAN DEFAULT 0;<br/>
&ensp; &ensp; &ensp;&ensp;DECLARE my_chirpid int;<br/>
&ensp; &ensp; &ensp;&ensp;DECLARE my_userid int default 0; <br/>   
&ensp; &ensp; &ensp;&ensp;DECLARE my_chirp CURSOR FOR SELECT id<br/>
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;FROM chirpr.chirps WHERE chirps.content REGEXP<br/>
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;CONCAT('@','[[:<:]]',my_username,'[[:>:]]');<br/><br/>
&ensp; &ensp; &ensp;&ensp;DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done=1;<br/>
&ensp; &ensp; &ensp;&ensp;SELECT COUNT(*) INTO my_userid FROM chirpr.users<br/>
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;WHERE LCASE(name) REGEXP<br/>
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;LCASE(CONCAT('[[:<:]]',my_username,'[[:>:]]'));<br/><br/>
&ensp; &ensp; &ensp;&ensp;IF (my_userid = 0) THEN<br/>
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;REPLACE INTO chirpr.users (name) VALUES (LCASE(my_username));<br/>
&ensp; &ensp; &ensp;&ensp;END IF;<br/>
&ensp; &ensp; &ensp;&ensp;OPEN my_chirp;<br/>
&ensp; &ensp; &ensp;&ensp;SELECT id INTO my_userid FROM chirpr.users<br />
&ensp; &ensp; &ensp;&ensp;&ensp;&ensp; &ensp;&ensp;WHERE name = my_username;<br/><br/>
&ensp; &ensp; &ensp;&ensp;REPEAT<br/>
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;FETCH my_chirp INTO my_chirpid;<br/>
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;REPLACE into chirpr.mentions (userid, chirpid)<br />
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;VALUES (my_userid, my_chirpid);<br/><br />
&ensp; &ensp; &ensp;&ensp;&ensp; &ensp; &ensp;&ensp;UNTIL done END REPEAT;<br/>
&ensp; &ensp; &ensp;&ensp;CLOSE my_chirp;<br/>
END //<br/>
DELIMITER ;<br/><br />
## Test Data
IT IS IMPORTANT THAT ALL DATA ENTRIES ARE ENTERED USING THE APPLICATION.<br />
DATA ENTERED MANUALLY WITH MYSQL WILL RESULT IN ERRORS.<br />
PLEASE ADD ALL DATA WITH 'ADD NEW CHIRP' NAV-LINK.<br />
#### ***Entry 1***
* **TITLE:** Grasshopper
* **IMAGE URL:** http://www.clker.com/cliparts/4/1/f/8/1516193030290013696free-clipart-grasshopper.med.png
* **MESSAGE:** Hey, I am a @Grasshopper, I am an @insect, I @chirp, and my nickname is @G_I.
---
#### ***Entry 2***
* **TITLE:** Goat
* **IMAGE URL:** http://www.clker.com/cliparts/6/5/3/a/12161376021593473697lemmling_Cartoon_goat.svg.med.png
* **MESSAGE:** Hey, I am a @Goat, I am a @mammal, I @maaaa and @bleat, and my nickname is @G_M.
---
#### ***Entry 3***
* **TITLE:** Goose
* **IMAGE URL:** http://www.clker.com/cliparts/8/0/2/b/1194985256153169136pennuto02.svg.med.png
* **MESSAGE:** Hey, I am a @Goose, I am a @bird, I @honk and @hiss, and my nickname is @G_B.
---
#### ***Entry 4***
* **TITLE:** Giraffe
* **IMAGE URL:** http://www.clker.com/cliparts/6/2/5/3/1215441305125576364lemmling_Cartoon_giraffe.svg.med.png
* **MESSAGE:** Hey, I am a @Giraffe, I am a @mammal, I @bleat, and my nickname is @G_M.
---
#### ***Entry 5***
* **TITLE:** Seahorse
* **IMAGE URL:** http://www.clker.com/cliparts/2/7/c/1/1195424723213055077liftarn_Seahorse.svg.med.png
* **MESSAGE:** Hey, I am a @Seahorse, I am a @fish, I have @gills, and my nickname is @S_F.
---
#### ***Entry 6***
* **TITLE:** Snake
* **IMAGE URL:** http://www.clker.com/cliparts/3/c/3/a/11970968082033464788johnny_automatic_rattle_snake.svg.med.png
* **MESSAGE:** Hey, I am a @Snake, I am a @reptile, I @hiss, and my nickname is @S_R.
---
#### ***Entry 7***
* **TITLE:** Frog
* **IMAGE URL:** http://www.clker.com/cliparts/9/f/1/5/1195423576772441789TheresaKnott_frog.svg.med.png
* **MESSAGE:** Hey, I am a @Frog, I am an @amphibian, I @croak, and my nickname is @F_A.
---
#### ***Entry 8***
* **TITLE:** Human
* **IMAGE URL:** http://www.clker.com/cliparts/5/7/a/f/11949845341956239011kid_01.svg.med.png
* **MESSAGE:** Hey, I am a @Human, I am a @mammal, I @talk, and my nickname is @H_M.
---
#### ***Entry 9***
* **TITLE:** Alligator
* **IMAGE URL:** http://www.clker.com/cliparts/m/N/c/Y/E/x/blue-gator-md.png
* **MESSAGE:** Hey, I am a @Alligator, I am a @reptile, I @hiss, and my nickname is @A_R.
---
#### ***Entry 10***
* **TITLE:** Hippo
* **IMAGE URL:** http://www.clker.com/cliparts/8/f/5/5/11954394142034688543TheStructorr_hippo.svg.med.png
* **MESSAGE:** Hey, I am a @Hippo, I am a @mammal, I @growl, and my nickname is @H_M.
---
## Key Features
Usernames are case-insensitive.The usernames are matched strictly letter-by-letter, and the sql tables for mentions 
and usernames are constantly updating. after each chirp update if a username is changed or removed an update is 
taking place in the database tables; dynamic deleting and inserting new users and mentions entries. When it comes to
testing it would be worthwhile to do tests updating chirp message body with new users or deleting users, or see what
happens when you delete all user instances; testing dynamic processes is something to look out for<b /><b />

Also, reading the information icons are very helpful when dealing with any submission page in order to 
follow the right steps and meet the right formats.<b /><b />

Lastly, I would like to apologize for any short comings in advance, I ran a lot of tests, but in one instance I tan into
an error that never occurred again, and I wasn't to trace it either.



 

## Server
The server build process compiles the TypeScript files found in `/src/server` into a single bundled JavaScript file located in the `/dist` directory.

## Client
The client build process compiles the React app located in `/src/client` into a bundled located at `/public/js/app.js`.

The client configuration will also build the Sass files found at `/src/client/scss`. The App component imports the `app.scss` file which already includes an import for Bootstrap.

## Running the project
In order to run the server, use `npm run dev`, and the server will start on port 3000 (http://localhost:3000). 

Webpack will watch the files. Once you save a file, you can refresh your browser to ensure you got the updated client files. If you only change server files, you *shouldn't* need to refresh.
