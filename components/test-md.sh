#!/bin/bash

set -e

docker-compose down --remove-orphans

docker-compose up -d --build dse

echo "Sleeping for 75s after dse starts"
sleep 75

echo "Connecting to DSE"
./bootstrap-md.sh

docker-compose up -d --build kafka

echo "Sleeping for 15s after kafka starts"
sleep 15

echo "Connecting to Kafka"
docker exec -it components_kafka_1 /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic m1D

docker-compose up -d --build redis

docker-compose up -d --build multiplexer-delivery
docker-compose scale multiplexer-delivery=3
docker-compose up -d --build produce-multiplexer-delivery

