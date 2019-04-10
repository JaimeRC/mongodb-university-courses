# Final Exam

## Question 1

### Problem:

Which of the following are valid command line instructions to start a mongod? You may assume that all specified files already exist.

- [ ] `mongod --dbpath /data/db --fork`
- [ ] `mongod --log /var/log/mongo/mongod.log --authentication`
- [x] `mongod -f /etc/mongod.conf`
- [x] `mongod --logpath /var/log/mongo/mongod.log --dbpath /data/db --fork`

***See detailed answer***

__The correct answers are:__

- `mongod --logpath /var/log/mongo/mongod.log --dbpath /data/db --fork`
- `mongod -f /etc/mongod.conf`

__The following choices are incorrect:__

- `mongod --dbpath /data/db --fork`

This is incorrect because a --logpath must be specified in order to fork the process.

- `mongod --log /var/log/mongo/mongod.log --authentication`

This is incorrect because both --log and --authentication are invalid flags - instead, they should say --logpath and --auth.

## Question 2

### Problem

Given the following config file:

        storage:
            dbPath: /data/db
        systemLog:
            destination: file
            path: /var/log/mongod.log
        net:
            bindIp: localhost,192.168.0.100
        security:
            keyFile: /var/pki/keyfile
        processManagement:
            fork: true

How many directories must MongoDB have access to? Disregard the path to the configuration file itself.

- [x] 3
- [ ] 4
- [ ] 2
- [ ] 1

***See detailed answer***

The correct answer is 3.

MongoDB must be able to access the data directory /data/db/, the log file mongod.log in /var/log/, and the keyfile keyfile in /var/pki/.

## Question 3

### Problem:

Given the following output from rs.status().members:

        [
            {
                "_id": 0,
                "name": "localhost:27017",
                "health": 1,
                "state": 1,
                "stateStr": "PRIMARY",
                "uptime": 548,
                "optime": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDate": ISODate("2018-03-14T14:47:51Z"),
                "electionTime": Timestamp(1521038358, 2),
                "electionDate": ISODate("2018-03-14T14:39:18Z"),
                "configVersion": 2,
                "self": true
            },
            {
                "_id": 1,
                "name": "localhost:27018",
                "health": 1,
                "state": 2,
                "stateStr": "SECONDARY",
                "uptime": 289,
                "optime": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDurable": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDate": ISODate("2018-03-14T14:47:51Z"),
                "optimeDurableDate": ISODate("2018-03-14T14:47:51Z"),
                "lastHeartbeat": ISODate("2018-03-14T14:47:56.558Z"),
                "lastHeartbeatRecv": ISODate("2018-03-14T14:47:56.517Z"),
                "pingMs": NumberLong("0"),
                "syncingTo": "localhost:27022",
                "configVersion": 2
            },
            {
                "_id": 2,
                "name": "localhost:27019",
                "health": 1,
                "state": 2,
                "stateStr": "SECONDARY",
                "uptime": 289,
                "optime": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDurable": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDate": ISODate("2018-03-14T14:47:51Z"),
                "optimeDurableDate": ISODate("2018-03-14T14:47:51Z"),
                "lastHeartbeat": ISODate("2018-03-14T14:47:56.558Z"),
                "lastHeartbeatRecv": ISODate("2018-03-14T14:47:56.654Z"),
                "pingMs": NumberLong("0"),
                "syncingTo": "localhost:27022",
                "configVersion": 2
            },
            {
                "_id": 3,
                "name": "localhost:27020",
                "health": 1,
                "state": 2,
                "stateStr": "SECONDARY",
                "uptime": 289,
                "optime": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDurable": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDate": ISODate("2018-03-14T14:47:51Z"),
                "optimeDurableDate": ISODate("2018-03-14T14:47:51Z"),
                "lastHeartbeat": ISODate("2018-03-14T14:47:56.558Z"),
                "lastHeartbeatRecv": ISODate("2018-03-14T14:47:56.726Z"),
                "pingMs": NumberLong("0"),
                "syncingTo": "localhost:27022",
                "configVersion": 2
            },
            {
                "_id": 4,
                "name": "localhost:27021",
                "health": 0,
                "state": 8,
                "stateStr": "(not reachable/healthy)",
                "uptime": 0,
                "optime": {
                "ts": Timestamp(0, 0),
                "t": NumberLong("-1")
                },
                "optimeDurable": {
                "ts": Timestamp(0, 0),
                "t": NumberLong("-1")
                },
                "optimeDate": ISODate("1970-01-01T00:00:00Z"),
                "optimeDurableDate": ISODate("1970-01-01T00:00:00Z"),
                "lastHeartbeat": ISODate("2018-03-14T14:47:56.656Z"),
                "lastHeartbeatRecv": ISODate("2018-03-14T14:47:12.668Z"),
                "pingMs": NumberLong("0"),
                "lastHeartbeatMessage": "Connection refused",
                "configVersion": -1
            },
            {
                "_id": 5,
                "name": "localhost:27022",
                "health": 1,
                "state": 2,
                "stateStr": "SECONDARY",
                "uptime": 289,
                "optime": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDurable": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDate": ISODate("2018-03-14T14:47:51Z"),
                "optimeDurableDate": ISODate("2018-03-14T14:47:51Z"),
                "lastHeartbeat": ISODate("2018-03-14T14:47:56.558Z"),
                "lastHeartbeatRecv": ISODate("2018-03-14T14:47:55.974Z"),
                "pingMs": NumberLong("0"),
                "syncingTo": "localhost:27017",
                "configVersion": 2
            },
            {
                "_id": 6,
                "name": "localhost:27023",
                "health": 1,
                "state": 2,
                "stateStr": "SECONDARY",
                "uptime": 289,
                "optime": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDurable": {
                "ts": Timestamp(1521038871, 1),
                "t": NumberLong("1")
                },
                "optimeDate": ISODate("2018-03-14T14:47:51Z"),
                "optimeDurableDate": ISODate("2018-03-14T14:47:51Z"),
                "lastHeartbeat": ISODate("2018-03-14T14:47:56.558Z"),
                "lastHeartbeatRecv": ISODate("2018-03-14T14:47:56.801Z"),
                "pingMs": NumberLong("0"),
                "syncingTo": "localhost:27022",
                "configVersion": 2
            }
        ]

At this moment, how many replica set members are eligible to become primary in the event of the current Primary crashing or stepping down?

- [ ] 7
- [x] 5
- [ ] 6
- [ ] 4

***See detailed answer***

The correct answer is 5.

Because this is failover, the node that was primary is now unreachable. We can also see from the output that the member with _id: 4 is also unreachable. That means 2 of the 7 nodes were unavailable, and that leaves us with 5 nodes eligible to become primary.

All other answers are incorrect. While the replica set is configured with 7 members, looking closely at the output we can see that one member is unreachable, specifically the member with _id: 4.

## Question 4

### Problem:

Given the following replica set configuration:

        conf = {
            "_id": "replset",
            "version": 1,
            "protocolVersion": 1,
            "members": [
                {
                "_id": 0,
                "host": "192.168.103.100:27017",
                "priority": 2,
                "votes": 1
                },
                {
                "_id": 0,
                "host": "192.168.103.100:27018",
                "priority": 1,
                "votes": 1
                },
                {
                "_id": 2,
                "host": "192.168.103.100:27018",
                "priority": 1,
                "votes": 1
                }
            ]
        }

What errors are present in the above replica set configuration?

- [ ] You can only specify a priority of 0 or 1, member "_id": 0 is incorrectly configured.
- [x] You cannot specify the same host information among multiple members.
- [x] You cannot specify two members with the same _id.
- [ ] You cannot have three members in a replica set.

***See detailed answer***

__Correct Answers__

- You cannot specify the same host information among multiple members.
- 
Host information must be unique for each member in a replica set.

- You cannot specify two members with the same _id.

_id must be unique for each member in a replica set.

__Incorrect Answers__

- You can only specify a priority of 0 or 1, member "_id": 0 is incorrectly configured.

Replica set members can have priority greater than 1, and this will increase the likelihood that a member becomes primary during an election (however, it cannot guarantee a node will become primary).

- You cannot have three members in a replica set.

Replica sets can have any number of members, although an odd number is recommended.

## Question 5

### Problem:

Given the following replica set configuration:

        conf = {
            "_id": "replset",
            "version": 1,
            "protocolVersion": 1,
            "members": [
                {
                "_id": 0,
                "host": "localhost:27017",
                "priority": 1,
                "votes": 1
                },
                {
                "_id": 1,
                "host": "localhost:27018",
                "priority": 1,
                "votes": 1
                },
                {
                "_id": 2,
                "host": "localhost:27019",
                "priority": 1,
                "votes": 1
                },
                {
                "_id": 3,
                "host": "localhost:27020",
                "priority": 0,
                "votes": 0,
                "slaveDelay": 3600
                }
            ]
        }

What is the most likely role served by the node with "_id": 3?

- [ ] It serves as a reference to perform analytics on how data is changing over time.
- [ ] It serves to service reads and writes for people in the same geographic region as the host machine.
- [x] It serves as a "hot" backup of data in case of accidental data loss on the other members, like a DBA accidentally dropping the database.
- [ ] It serves as a hidden secondary available to use for non-critical analysis operations.

***See detailed answer***

The correct answer is:

- It serves as a "hot" backup of data in case of accidental data loss on the other members, like a DBA accidentally dropping the database.

The node with "_id": 3 is delayed by 1 hour. So if a DBA drops a database, that database will be dropped from all secondary nodes without a delay, but it will still be present on the node with "_id": 3 for 1 hour.

All other answers are incorrect.

## Question 6:

### Problem:

Given the following shard key:

        { "country": 1, "_id": 1 }

Which of the following queries will be routed (targeted)? Remember that queries may be routed to more than one shard.

- [ ] `db.customers.find({"_id": 455})`
- [x] `db.customers.find({"country": "Norway", "_id": 54})`
- [x] `db.customers.find({"_id": 914, "country": "Sweden"})`
- [x] `db.customers.find({"country": { $gte: "Portugal", $lte: "Spain" }})`

***See detailed answer***

__The correct answers are:__

- `db.customers.find({"country": "Norway", "_id": 54})`

This specifies both indexes used in the shard key.

- `db.customers.find({"country": { $gte: "Portugal", $lte: "Spain" }})`

This specifies a prefix of the indexes used in the shard key, "country", and will be routed to shards containing the necessary information.

- `db.customers.find({"_id": 914, "country": "Sweden"})`

Although the indexes are specified in reverse order, this is a routed query. Any document matching {"_id": 914, "country": "Sweden"} must be identical to {"country": "Sweden", "_id": 914}. The query planner will take advantage of this and reorder the fields.

__The incorrect answer is:__

- `db.customers.find({"_id": 455})`

Because the neither a prefix nor the full shard key is provided, mongos has no way to determine how to appropriately route this query. Instead, it will send this query to all shards in the cluster in a scatter-gather operation.