#!/bin/bash

redis-cli del monitor:m1:count
redis-cli del monitor:m1:startTime
redis-cli del monitor:m1:endTime

docker-compose -f docker-compose-capacity.yml scale multiplexer=0
