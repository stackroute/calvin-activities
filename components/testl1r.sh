#!/bin/bash

set -e

docker-compose down --remove-orphans

docker-compose up -d --build kafka

sleep 20

chmod +x ./bootstrapl1r.sh 

./bootstrapl1r.sh

docker-compose up -d --build redis

docker-compose up -d --build l1r

docker-compose scale l1r=3

docker-compose up -d --build produce

