#!/bin/bash

set -e

echo PARTITION_COUNT is $PARTITION_COUNT
echo NUMBER_OF_MESSAGES is $NUMBER_OF_MESSAGES

export PARTITION_COUNT=$PARTITION_COUNT
export NUMBER_OF_MESSAGES=$NUMBER_OF_MESSAGES

docker-compose down --remove-orphans

docker-compose -f services.yml up -d

echo "Sleeping for 10s after kafka starts"
sleep 10

./bootstrap.sh $PARTITION_COUNT

# Setup routes
for i in $( seq 0 99 ); do redis-cli SADD m1:baz $i; done;

docker-compose -f docker-compose-capacity.yml up -d --build multiplexer
# docker-compose -f docker-compose-capacity.yml scale multiplexer=$PARTITION_COUNT
# docker-compose -f docker-compose-capacity.yml up -d --build produce
