#!/bin/bash
docker exec -it components_kafka_1 /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dev_activities

docker exec -it components_kafka_1 /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dev_m1

docker exec -it components_kafka_1 /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dev_m1D

docker exec -it components_kafka_1 /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dev_events

docker exec -it components_kafka_1 /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dev_routes

echo "created topics"


# set -e
set -e

docker exec -it components_cassandra_1 cqlsh -e "create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"

docker exec -it components_cassandra_1 cqlsh -e "create table testdb.circle (circleId uuid, mailboxId uuid, createdOn timestamp, lastPublishedActivity timestamp, PRIMARY KEY(circleId, createdOn)) WITH CLUSTERING ORDER BY (createdOn DESC)"

docker exec -it components_cassandra_1 cqlsh -e "create table testdb.mailbox(mailboxId uuid primary key)"

docker exec -it components_cassandra_1 cqlsh -e "create table testdb.mailboxesFollowingCircle(circleId uuid,mailboxId uuid, startedFollowing timestamp, primary key(circleId, mailboxId)) WITH CLUSTERING ORDER BY (mailboxId DESC)"

docker exec -it components_cassandra_1 cqlsh -e "create table testdb.circlesFollowedByMailbox(circleId uuid,mailboxId uuid, startedFollowing timestamp, primary key(mailboxId, circleId)) WITH CLUSTERING ORDER BY (circleId DESC)"

docker exec -it components_cassandra_1 cqlsh -e "CREATE TABLE testdb.activity (mailboxid uuid,createdat timestamp,payload text,PRIMARY KEY (mailboxid, createdat)) WITH CLUSTERING ORDER BY (createdat DESC)"

docker exec -it components_cassandra_1 cqlsh -e "CREATE TABLE testdb.domain (domain text PRIMARY KEY, circleid uuid, mailboxid uuid)"

docker exec -it components_cassandra_1 cqlsh -e "CREATE TABLE testdb.user (user text PRIMARY KEY,mailboxid uuid)"

echo "created tables"