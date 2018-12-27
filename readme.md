docker run --name cassandra -d -e CASSANDRA_BROADCAST_ADDRESS=127.0.0.1 -p 9042:9042 bitnami/cassandra:latest

node app