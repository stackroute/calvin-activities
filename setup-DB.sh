#!/bin/bash

set -e

cqlsh -e "create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"

cqlsh -e "create table testdb.circle (circleId uuid, mailboxId uuid, createdOn timestamp, PRIMARY KEY(circleId, createdOn)) WITH CLUSTERING ORDER BY (createdOn DESC)"

cqlsh -e "create table testdb.mailbox(mailboxId uuid primary key)"

cqlsh -e "create table testdb.mailboxesFollowingCircle(circleId uuid,mailboxId uuid, startedFollowing timestamp, primary key(circleId,startedFollowing)) WITH CLUSTERING ORDER BY (startedFollowing DESC)"

cqlsh -e "create table testdb.circlesFollowedByMailbox(mailboxId uuid, circleId uuid, startedFollowing timestamp, primary key(mailboxId,startedFollowing)) WITH CLUSTERING ORDER BY (startedFollowing DESC)"

cqlsh -e "CREATE TABLE testdb.activity (mailboxid uuid,createdat timestamp,payload text,PRIMARY KEY (mailboxid, createdat)) WITH CLUSTERING ORDER BY (createdat DESC)"
