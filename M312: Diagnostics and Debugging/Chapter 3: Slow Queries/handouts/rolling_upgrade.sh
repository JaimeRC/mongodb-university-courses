#!/usr/bin/env bash

# Connect to the primary to kill the server on port 30002
mongo --port 30000

# See that there are only 2 mongod's running.
ps -ef | grep mongo

# Restart the replica set member we just shut down as a standalone.
# Note that the `--replSet m312RS`` option is gone
startStandaloneMember3=$(ps -ef | grep mongo | grep rs2 | sed 's/rs2/rs3/g' | sed 's/30001/40002/g' | sed 's/^.*mongod --replSet m312RS/mongod/')
echo $startStandaloneMember3  # see the command
eval $startStandaloneMember3  # run the command
mongo --port 40002 m312  # go to the standalone

# Now, it's time to restart this server back into the replica set. Note that the "--replSet" option is back.
startRSMember3=$(ps -ef | grep mongo | grep rs2 | sed 's/rs2/rs3/g' | sed 's/30001/30002/g' | sed 's/^.*mongod --replSet m312RS/mongod --replSet m312RS/')
echo $startRSMember3
eval $startRSMember3

# And connect to the primary.
mongo --port 30000 m312


# Restart the other secondary, as a standalone, and connect.
startStandaloneMember2=$(ps -ef | grep mongo | grep rs3 | sed 's/rs3/rs2/g' | sed 's/30002/40001/g' | sed 's/^.*mongod --replSet m312RS/mongod/')
echo $startStandaloneMember2
eval $startStandaloneMember2
mongo --port 40001 m312

# Restart the second secondary, go back to the primary, and confirm the replica set status.
startRSMember2=$(ps -ef | grep mongo | grep rs3 | sed 's/rs3/rs2/g' | sed 's/30002/30001/g' | sed 's/^.*mongod --replSet m312RS/mongod --replSet m312RS/')
echo $startRSMember2
eval $startRSMember2

# Restart the old primary on a new port to build the index
startStandaloneMember1=$(ps -ef | grep mongo | grep rs3 | sed 's/rs3/rs1/g' | sed 's/30002/40000/g' | sed 's/^.*mongod --replSet m312RS/mongod/')
echo $startStandaloneMember1
eval $startStandaloneMember1
mongo --port 40000 m312

# Restart the old primary back into the replica set.
startRSMember1=$(ps -ef | grep mongo | grep rs3 | sed 's/rs3/rs1/g' | sed 's/30002/30000/g' | sed 's/^.*mongod --replSet m312RS/mongod --replSet m312RS/')
echo $startRSMember1
eval $startRSMember1
mongo --port 30000 m312


