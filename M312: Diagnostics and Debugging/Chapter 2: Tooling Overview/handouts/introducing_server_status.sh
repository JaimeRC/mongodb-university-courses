#!/usr/bin/env bash

# bring up a mongod
mongod --dbpath /data/rs/p --logpath /data/rs/p/mongod.log --fork

# run server status
mongo --eval ' db.serverStatus() '

# show serverStatus shell method
mongo --eval ' db.serverStatus '

# run serverStatus by projecting only certain fields
mongo --eval ' db.runCommand({ serverStatus: 1, repl: 0, metrics: 0, locks: 1, wiredTiger: 0}) '

# using Object.keys() object
mongo --eval ' Object.keys( db.serverStatus()) '

# for loop that iterates over few documents with a sleep
mongo --eval ' while(true) { for (i=1; i<=10; i++){
  db.things.insertOne({}); sleep(1000);
}} '

# check the number of inserts that occured since the mongod has been up
mongo --eval ' db.serverStatus().opcounters.insert '

# some of different information in the `serverStatus`
mongo --eval '
db.serverStatus().host;
db.serverStatus().version;
db.serverStatus().process;
db.serverStatus().pid;
db.serverStatus().uptime;
db.serverStatus().uptimeMillis;
db.serverStatus().localTime;
'

# check the number of connections
mongo --eval ' db.serverStatus().connections '

# kill the mongod process
processId=$(ps -ef | grep mongod | grep '/data/rs/p' | awk '{print $2}')
kill -9 $processId

# let's set the maxConns setting
mongod --dbpath /data/rs/p --logpath /data/rs/p/mongod.log --fork --maxConns 10

# check the number of connections
mongo --eval ' db.serverStatus().connections '
