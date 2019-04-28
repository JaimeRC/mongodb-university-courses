# Chapter 4: Connectivity

## 4.1 Timeouts

### Quiz

wtimeout can be set by the application to guarantee that:

- [ ] MongoDB will roll back the write operations if the nodes do not acknowledge the write operation within the specified wtimeout.
- [x] If a write is acknowledged, the replica set has applied the write on a number of servers within the specified wtimeout.
- [ ] The application will learn how many servers have performed the write within wtimeout.

***See detailed answer***

The correct answer is:

- If a write is acknowledged, the replica set has applied the write on a number of servers within the specified wtimeout.

Incorrect answers are:

- MongoDB will roll back the write operations if the nodes do not acknowledge the write operation within the specified wtimeout.
    - MongoDB does not roll back writes that fail to achieve the write concern's "w" parameter within the specified wtimeout. If the primary has received them, they are most likely on the primary, and possibly other servers. Any further writes will need to be done by the application.

- The application will learn how many servers have performed the write within wtimeout.
    - All the application knows is that it has not received acknowledgment within wtimeout. No further information is known at this time.

## 4.2 Closing and Dropping Connections

### Quiz 

Which of the following will affect the number of available incoming connections a mongod instance will allow to be established?

- [x] OS ulimits
- [x] net.maxIncomingConnections configuration file parameter
- [ ] 65536 is the max number of connections, no other limit will apply

***See detailed answer***

The following are true:

- OS ulimits
    - The number of allowed open files will affect the number of connections that a mongod will be allowed to establish

- net.maxIncomingConnections configuration file parameter
    - This configuration option will allow the system administrator to determine a max number of incoming connections

This is false:

- 65536 is the max number of connections, no other limit will apply
    - Obviously, this can't be true, since the others are.
    
## 4.3 Write Concern and Timeouts

### Quiz

For a 7-member replica set with one arbiter and one delayed secondary, how many members are needed in order to acknowledge { w : "majority" }` before the wtimeout is hit?

- [ ] 1
- [ ] 2
- [ ] 3
- [x] 4
- [ ] 5
- [ ] 6
- [ ] 7

***See detailed answer***

For a 7-member replica set, the answer is always 4. The arbiter and the delayed secondary don't change that fact.

The danger is that, if there's both an arbiter and a delayed secondary, there are only 5 other servers that are providing availability. If two data-bearing servers go down, your replica set will be able to elect a primary, but will not be able to acknowledge writes with `{ w : majority }`.

## 4.4 Hostnames and Cluster Configuration

### Quiz

When connecting to a MongoDB Cluster, I should guarantee that:

- [x] The application should use more than one replica set member in the connection string
- [x] All mongos's and replica set members are addressable by the client and application hosts
- [ ] We can set any NIC or hostname for our replica set configuration set, since MongoDB will figure things out for us.

***See detailed answer***

The following are true:

- All mongos's and replica set members are addressable by the client and application hosts
- The application should use more than one replica set member in the connection string

Confirming these can avoid problems with hostnames later on.

The following is false:

- We can set any NIC or hostname for our replica set configuration set, since MongoDB will figure things out for us.

Definitely not the case. MongoDB will use the hostnames given, which may seem to work fine until a part of the cluster (or the application) can no longer rely on its hostnames.

## 4.5 Sharding Issues

### Quiz

Assuming the default chunk size, which of the following is/are jumbo chunks?

- [ ] 10 MB
- [ ] 20 MB
- [ ] 50 MB
- [x] 100 MB
- [x] 200 MB
- [x] 500 MB

***See detailed answer***

The default chunk size is 64 MB. 50 MB is below this, so all choices below and including 50 MB were wrong. The answers 100 MB and above are correct. You could see in the video that the balancer wouldn't move these until we changed the chunk size.

