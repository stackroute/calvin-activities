#!/bin/bash
set -e

docker exec -it components_dse_1 cqlsh -e "create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"
docker exec -it components_dse_1 cqlsh -e "create table testdb.circle (id uuid primary key)"
docker exec -it components_dse_1 cqlsh -e "create table testdb.mailbox(id uuid primary key)"
docker exec -it components_dse_1 cqlsh -e "insert into testdb.mailbox (id) values (9da64d71-fc74-4c45-9249-153d4751c7a6)"
docker exec -it components_dse_1 cqlsh -e "create table testdb.follow(circleId uuid,mailboxId uuid, primary key(circleid,mailboxid))"
docker exec -it components_dse_1 cqlsh -e "create table testdb.activity (mailboxid uuid,createdat timestamp,payload text,PRIMARY KEY (mailboxid, createdat)) WITH CLUSTERING ORDER BY (createdat DESC)"
