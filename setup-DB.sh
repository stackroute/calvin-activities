#!/bin/bash

set -e

cqlsh -e "create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"
cqlsh -e "create table testdb.circle (circleId uuid, mailboxId uuid, createdOn timestamp, PRIMARY KEY(circleId, createdOn)) WITH CLUSTERING ORDER BY (createdOn DESC)"
cqlsh -e "create table testdb.mailbox(mailboxId uuid primary key)"
# cqlsh -e "create table testdb.follow(circleId uuid,mailboxId uuid, primary key(circleid,mailboxid))"
# cqlsh -e "CREATE TABLE testdb.activity (mailboxid uuid,createdat timestamp,payload text,PRIMARY KEY (mailboxid, createdat)) WITH CLUSTERING ORDER BY (createdat DESC)"
