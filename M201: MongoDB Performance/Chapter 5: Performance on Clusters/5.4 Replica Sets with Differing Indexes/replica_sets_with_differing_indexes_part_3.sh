#!/usr/bin/env bash

# after shutting down the secondary with priority 0 restart it as a standalone
mongod --port 27002 --dbpath /data/r2 --logpath /data/r2/standalone.log --fork

# connect to the member
mongo --port 27002


# after shutting down the server again, restart it with it's original config
mongod -f r2.cfg

# reconnect to the replica set
mongo --host M201/localhost:27001,localhost:27002,localhost:27000