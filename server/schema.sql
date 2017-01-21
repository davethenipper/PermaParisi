CREATE TABLE accountTable (
  Username VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  FirstName VARCHAR(255),
  LastName VARCHAR(255),
  Profile BLOB,
  Phone VARCHAR(255),
  Email VARCHAR(255),
  Zip INT,
  Picture VARCHAR(255)
  PRIMARY KEY (Username)
);

CREATE TABLE activityTable (
  ActivityId INT NOT NULL AUTO_INCREMENT,
  ActivityName VARCHAR(255),
  Description BLOB,
  Lat FLOAT( 10, 6 ) NOT NULL,
  Lng FLOAT( 10, 6 ) NOT NULL,
  Summary VARCHAR(255),
  Type VARCHAR(255),
  TimeToComplete INT NOT NULL,
  MinTime INT,
  MaxTime INT,
  Image VARCHAR(255),
  TimeCreated TIMESTAMP,
  TimeModified TIMESTAMP,
  PRIMARY KEY (ActivityId)
);

CREATE TABLE activityList (
  ListId INT NOT NULL AUTO_INCREMENT,
  ListName VARCHAR(255),
  ActivityName VARCHAR(255),
  ActivityId INT,
  Completed ENUM('Y', 'N'),
  PRIMARY KEY (ListId, ActivityName),
  FOREIGN KEY (ActivityId) REFERENCES activityTable(ActivityId)
);

CREATE TABLE userListAcl (
  ListId INT NOT NULL,
  Username VARCHAR(255) NOT NULL,
  Permissions ENUM('Private', 'FriendsRead', 'FriendsWrite', 'GlobalRead'),
  PRIMARY KEY (ListId, Username),
  FOREIGN KEY (ListId) REFERENCES activityList(ListId),
  FOREIGN KEY (Username) REFERENCES accountTable(Username)
);
