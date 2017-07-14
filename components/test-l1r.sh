#!/bin/bash

set -e

docker-compose down --remove-orphans

docker-compose up -d --build kafka

echo "Sleeping for 5s after kafka starts"
sleep 5

chmod +x ./bootstrap-l1r.sh 

./bootstrap-l1r.sh

docker-compose up -d --build redis

# Setup routes
redis-cli SADD L1R:baz m1
redis-cli SADD L1R:baz m2
redis-cli SADD L1R:baz m3

docker-compose up -d --build l1r

docker-compose scale l1r=3

docker-compose up -d --build produce-l1r

