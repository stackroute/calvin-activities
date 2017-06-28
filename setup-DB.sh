#!/bin/bash

set -e

cqlsh -e "create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"
cqlsh -e "create table testdb.circle (id uuid primary key)"
cqlsh -e "create table testdb.mailbox(id uuid primary key)"
cqlsh -e "create table testdb.follow(circleId uuid,mailboxId uuid, primary key(circleid,mailboxid))"
