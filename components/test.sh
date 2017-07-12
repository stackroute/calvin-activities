#!/bin/bash

set -e

docker-compose down --remove-orphans

docker-compose up -d --build kafka

echo "Sleeping for 5s after kafka starts"
sleep 5

./bootstrap.sh

docker-compose up -d --build redis

# Setup routes
for i in $( seq 0 99 ); do redis-cli SADD m1:baz $i; done;

docker-compose up -d --build multiplexer
docker-compose scale multiplexer=3
docker-compose up -d --build produce

