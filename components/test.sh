#!/bin/bash

set -e

docker-compose down --remove-orphans

docker-compose -f services.yml up -d

echo "Sleeping for 10s after kafka starts"
sleep 10

./bootstrap.sh

# Setup routes
for i in $( seq 0 99 ); do redis-cli SADD m1:baz $i; done;

docker-compose -f docker-compose-capacity.yml up -d --build multiplexer
docker-compose scale multiplexer=10
docker-compose -f docker-compose-capacity.yml up -d --build produce
