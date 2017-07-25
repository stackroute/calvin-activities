#!/bin/bash

set -e

cqlsh -e "create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"

cqlsh -e "create table testdb.circle (circleId uuid, mailboxId uuid, createdOn timestamp, lastPublishedActivity timestamp, PRIMARY KEY(circleId, createdOn)) WITH CLUSTERING ORDER BY (createdOn DESC)"

cqlsh -e "create table testdb.mailbox(mailboxId uuid primary key)"

cqlsh -e "create table testdb.mailboxesFollowingCircle(circleId uuid,mailboxId uuid, startedFollowing timestamp, primary key(circleId, mailboxId)) WITH CLUSTERING ORDER BY (mailboxId DESC)"

cqlsh -e "create table testdb.circlesFollowedByMailbox(circleId uuid,mailboxId uuid, startedFollowing timestamp, primary key(mailboxId, circleId)) WITH CLUSTERING ORDER BY (circleId DESC)"

cqlsh -e "CREATE TABLE testdb.activity (mailboxid uuid,createdat timestamp,payload text,PRIMARY KEY (mailboxid, createdat)) WITH CLUSTERING ORDER BY (createdat DESC)"

cqlsh -e "CREATE TABLE testdb.domain (domain text PRIMARY KEY, circleid uuid, mailboxid uuid)"

cqlsh -e "CREATE TABLE testdb.user (user text PRIMARY KEY,mailboxid uuid)"