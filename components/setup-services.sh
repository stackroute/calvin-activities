#!/bin/bash
set -e

docker-compose -f services.yml down --remove-orphans

docker-compose -f services.yml up -d --build redis
docker-compose -f services.yml up -d --build kafka

docker-compose down
docker-compose -f docker-compose.yml -f docker-compose-local.yml up -d --build rest-api
