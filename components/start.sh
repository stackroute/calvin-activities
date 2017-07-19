docker-compose down --remove-orphans

docker-compose up -d --build rest-api
docker-compose up -d --build event-adapter
docker-compose up -d --build event-processor
docker-compose up -d --build routes-manager
docker-compose up -d --build l1r
docker-compose up -d --build multiplexer
docker-compose up -d --build multiplexer-delivery