#!/bin/bash

docker-compose up -d kafka

./bootstrap.sh

# Publish 1000000 messages

docker-compose up -d
