# Development Requirements

1. Docker
2. NodeJS v8.5

# Running

```
$ git submodule init
$ git submodule update
$ cd components
$ docker-compose -f services.yml up -d
```
At this point, wait for sometime (100s) for cassandra and kafka services to start
```
$ ./seed-data.sh
$ export ver=1
$ docker-compose -f docker-compose.yml -f docker-compose-local.yml up -d
```

> Note: When running docker-compose commands, you may get a warning saying that other containers are running. This is because docker-compose uses the directory name as the context, and since we are running dependent services (kafka, dse) and application service containers using two separate files, they share the same context, and each is unaware of services from other file. Using --remove-orphans will cause the other services to be removed, so avoid using it.

API documentation can now be accessed at url [http://localhost:4000/swagger](http://localhost:4000/swagger)
