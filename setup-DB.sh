#!/bin/bash

set -e

cqlsh -e "create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"
cqlsh -e "create table testdb.circle (circleId uuid, mailboxId uuid, createdOn timestamp, lastActivity timestamp, PRIMARY KEY(circleId, lastActivity)) WITH CLUSTERING ORDER BY (lastActivity DESC)"
cqlsh -e "create table testdb.mailbox(id uuid primary key)"
cqlsh -e "create table testdb.follow(circleId uuid,mailboxId uuid, primary key(circleid,mailboxid))"
cqlsh -e "CREATE TABLE testdb.activity (mailboxid uuid,createdat timestamp,payload text,PRIMARY KEY (mailboxid, createdat)) WITH CLUSTERING ORDER BY (createdat DESC)"
