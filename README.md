docker run \
 --name postgres \
 -e POSTGRES_USER=franciscogsilverio \
 -e POSTGRES_PASSWORD=secretpassword \
 -e POSTGRES_DB=heroes \
 -p 5432:5432 \
 -d \
 postgres

 docker ps
 docker exec -it postgres /bin/bash

docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres:postgres \
    -d \
    adminer

## --- MongoDB

sudo docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=adminpassword \
    -d \
    mongo:4

sudo docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

sudo docker exec -it mongodb \
    mongo --host localhost -u admin -p adminpassword --authenticationDatabase admin \
    --eval "db.getSiblingDB('heroes').createUser({user: 'franciscogsilverio', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db:'heroes'}]})"