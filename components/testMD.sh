#!/bin/bash

set -e

docker-compose down --remove-orphans

docker-compose up -d --build dse

echo "Sleeping for 15s after dse starts"
sleep 15

./bootstrapMD.sh

docker-compose up -d --build kafka

docker-compose up -d --build redis

docker-compose up -d --build multiplexer-delivery
docker-compose scale multiplexer-delivery=3
docker-compose up -d --build produce

