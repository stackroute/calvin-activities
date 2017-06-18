# Setup Cassandra and Docker for development

After cloning this repository, cd into dev-setup directory, and run ```sudo ./dev-setup.sh```

For starting cqlsh, run ```sudo docker exec -it tmp_cassandra_1 cqlsh```

To create keyspace, run ```create keyspace testdb with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };```

run ```use testdb``

To create table ```create table circle (id uuid primary key); ```
