#!/bin/bash

# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic m1
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic m1D
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic m2
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic m2D
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic m3
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic m3D
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic as_demo_activities
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic as_demo_routes
# /opt/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 5 --topic as_demo_events

curl -X POST "http://localhost:4000/multiplexer/m1" -H "accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg"
curl -X POST "http://localhost:4000/multiplexer/m2" -H "accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg"
curl -X POST "http://localhost:4000/multiplexer/m3" -H "accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg"
