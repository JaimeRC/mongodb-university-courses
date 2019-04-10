# Chapter 3: Sharding

## 3.1 When to Shard

### Quiz

Which of the following scenarios drives us to shard our cluster?

- [x] When holding more than 5TB per server and operational costs increase dramatically.
- [ ] When our server disks are full.
- [x] When we reach the most powerful servers available, maximizing our vertical scale options.
- [x] Data sovereignty laws require data to be located in a specific geography.
- [ ] When we start a new project with MongoDB.

***See detailed asnwer***

__Correct answers:__

- __When we reach the most powerful servers available, maximizing our vertical scale options.__

Sharding can provide an alternative to vertical scaling.

- __Data sovereignty laws require data to be located in a specific geography.__

Sharding allows us to store different pieces of data in specific countries or regions.

- __When holding more than 5TB per server and operational costs increase dramatically.__

Generally, when our deployment reaches 2-5TB per server, we should consider sharding.

__Incorrect answers:__

- __When we start a new project with MongoDB.__

We should carefully consider if we need to have a sharding system out of the start. This might be required for some projects, but certainly not always the ideal moment to address scalability needs.

- __When our server disks are full.__

Maxing out the capacity of our disks is not a reason for sharding. Scaling up might make more sense than to add complexity to our system.

## 3.2 Sharding Architecture

### Quiz 

What is true about the primary shard in a cluster?

- [ ] Client applications communicate directly with the primary shard.
- [ ] The primary shard always has more data than the other shards.
- [x] The role of primary shard is subject to change.
- [x] Shard merges are performed by the mongos.
- [x] Non-sharded collections are placed on the primary shard.

***See detailed answer***

__Correct answers:__

- __The role of primary shard is subject to change.__

We can manually change the primary shard of a database, if we need to.

- __Non-sharded collections are placed on the primary shard.__

Until the collection is sharded, mongos will place it on the primary shard of its database.

- __Shard merges are performed by the mongos.__

When documents are fetched from multiple shards, mongos has to gather and organize those documents in a shard_merge.

__Incorrect answers:__

- __The primary shard always has more data than the other shards.__

The primary shard may have more data, because non-sharded collections will only exist on the primary shard. But this is not necessarily the case.

- __Client applications communicate directly with the primary shard.__

Clients communicate with the mongos, which communicates to the shards in a cluster - this includes the primary shard.

## 3.3 Setting Up a Sharded Cluster


### Lecture Instructions

Configuration file for first config server csrs_1.conf:

        sharding:
            clusterRole: configsvr
        replication:
            replSetName: m103-csrs
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26001
        systemLog:
            destination: file
            path: /var/mongodb/db/csrs1.log
            logAppend: true
        processManagement:
            fork: true
        storage:
            dbPath: /var/mongodb/db/csrs1

csrs_2.conf:

        sharding:
            clusterRole: configsvr
        replication:
            replSetName: m103-csrs
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26002
        systemLog:
            destination: file
            path: /var/mongodb/db/csrs2.log
            logAppend: true
        processManagement:
            fork: true
        storage:
            dbPath: /var/mongodb/db/csrs2

csrs_3.conf:

        sharding:
            clusterRole: configsvr
        replication:
            replSetName: m103-csrs
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26003
        systemLog:
            destination: file
            path: /var/mongodb/db/csrs3.log
            logAppend: true
        processManagement:
            fork: true
        storage:
            dbPath: /var/mongodb/db/csrs3

Starting the three config servers:

        mongod -f csrs_1.conf
        mongod -f csrs_2.conf
        mongod -f csrs_3.conf

Connect to one of the config servers:

        mongo --port 26001

Initiating the CSRS:

        rs.initiate()

Creating super user on CSRS:

        use admin
        db.createUser({
            user: "m103-admin",
            pwd: "m103-pass",
            roles: [
                {role: "root", db: "admin"}
            ]
        })

Authenticating as the super user:

    db.auth("m103-admin", "m103-pass")

Add the second and third node to the CSRS:

        rs.add("192.168.103.100:26002")
        rs.add("192.168.103.100:26003")

Mongos config (mongos.conf):

        sharding:
            configDB: m103-csrs/192.168.103.100:26001,192.168.103.100:26002,192.168.103.100:26003
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26000
        systemLog:
            destination: file
            path: /var/mongodb/db/mongos.log
            logAppend: true
        processManagement:
            fork: true

Connect to mongos:

        vagrant@m103:~$ mongo --port 26000 --username m103-admin --password m103-pass --authenticationDatabase admin

Check sharding status:

        MongoDB Enterprise mongos> sh.status()

Updated configuration for node1.conf:

        sharding:
            clusterRole: shardsvr
        storage:
            dbPath: /var/mongodb/db/node1
        wiredTiger:
            engineConfig:
                cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27011
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/node1/mongod.log
            logAppend: true
        processManagement:
            fork: true
        replication:
            replSetName: m103-repl

Updated configuration for node2.conf:

        sharding:
            clusterRole: shardsvr
        storage:
            dbPath: /var/mongodb/db/node2
        wiredTiger:
            engineConfig:
                cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27012
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/node2/mongod.log
            logAppend: true
        processManagement:
            fork: true
        replication:
            replSetName: m103-repl

Updated configuration for node3.conf:

        sharding:
            clusterRole: shardsvr
        storage:
            dbPath: /var/mongodb/db/node3
        wiredTiger:
            engineConfig:
               cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27013
        security:
            eyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/node3/mongod.log
            logAppend: true
        processManagement:
            fork: true
        replication:
            replSetName: m103-repl

Connecting directly to secondary node (note that if an election has taken place in your replica set, the specified node may have become primary):

        mongo --port 27012 -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

Shutting down node:

        use admin
        db.shutdownServer()

Restarting node with new configuration:

        mongod -f node2.conf

Stepping down current primary:

        rs.stepDown()

Adding new shard to cluster from mongos:

        sh.addShard("m103-repl/192.168.103.100:27012")

### Quiz

What is true about the mongos?

- [ ] The mongos configuration file doesn't need to have a port.
- [ ] Users must be created on mongos when auth is enabled.
- [x] The mongos configuration file needs to specify the config servers.
- [ ] The config server configuration files need to specify mongos.
- [x] The mongos configuration file doesn't need to have a dbpath.

***See detailed answer***

__Correct answers:__

- __The mongos configuration file needs to specify the config servers.__

Mongos uses the data from the config servers, so it cannot function without communicating with the CSRS.

- __The mongos configuration file doesn't need to have a dbpath.__

Mongos doesn't store any data itself, because all the data it uses is stored on the config servers.

__Incorrect answers:__

- __The config server configuration files need to specify mongos.__

Mongos' configuration file references the CSRS or standalone config server; not the other way around.

- __Users must be created on mongos when auth is enabled.__

Mongos inherits its users from the config servers.

- __The mongos configuration file doesn't need to have a port.__

Every mongos (and mongod) process needs to be assigned a port to run on.

## Lab - Configure a Sharded Cluster

### Problem

In this lab, you will turn your replica set into one shard in a sharded cluster. To begin your sharded cluster configuration in MongoDB, you will need to do the following:

1. Bring up config servers
2. Bring up mongos
3. Enable sharding on m103-repl
4. Add m103-repl as the primary shard in the cluster

__1. Bring up the config server replica set (CSRS)__

Config servers store all of the metadata for a sharded cluster, making them a necessary part of any sharded cluster. In this lab you will bring up a replica set of three config servers (m103-csrs) to store this metadata.

Here are the requirements for all three config servers:

Type | Primary | Secondary | Secondary
- | - | - | -
Port | 26001 | 26002 | 26003
DBPath | /var/mongodb/db/csrs1 | /var/mongodb/db/csrs2 | /var/mongodb/db/csrs3
LogPath | /var/mongodb/db/csrs1/mongod.log | /var/mongodb/db/csrs2/mongod.log | /var/mongodb/db/csrs3/mongod.log
replSetName | m103-csrs | m103-csrs | m103-csrs
clusterRole | configsvr | configsvr | configsvr
keyFile | /var/mongodb/pki/m103-keyfile | /var/mongodb/pki/m103-keyfile | /var/mongodb/pki/m103-keyfile

Here is the config file for the primary config server:

        sharding:
            clusterRole: configsvr
        replication:
            replSetName: m103-csrs
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26001
        systemLog:
            destination: file
            path: /var/mongodb/db/csrs1/mongod.log
            logAppend: true
        processManagement:
            fork: true
        storage:
            dbPath: /var/mongodb/db/csrs1

You may use this config file for your primary config server, but you will need to make two more to complete the replica set.

Notice that the CSRS has the same keyFile as the data-bearing replica set m103-repl. Because m103-repl uses internal keyfile authentication, all other mongod and mongos processes in your cluster must use internal keyfile authentication with the same keyfile.

When initializing m103-csrs, remember that keyfile authentication implies client authentication. This means that while no users are configured, the CSRS will only allow connections through the localhost.

As a reminder, here are the login credentials of the admin user from previous labs:

        Role: root on admin database
        Username: m103-admin
        Password: m103-pass

__2. Bring up the mongos__

Once the CSRS is running, you can start up the mongos process. Here is the config file for the mongos:

        sharding:
            configDB: m103-csrs/192.168.103.100:26001
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26000
        systemLog:
            destination: file
            path: /var/mongodb/db/mongos.log
            logAppend: true
        processManagement:
            fork: true

If your CSRS already has the m103-admin user when mongos is started, mongos will inherit that user. You will be able to authenticate to mongos immediately as m103-admin.

__3. Reconfigure m103-repl__

To enable m103-repl to be a shard, you must reconfigure the nodes in your replica set with the following lines added to each of their config files:

        sharding:
            clusterRole: shardsvr
        storage:
            wiredTiger:
                engineConfig:
                    cacheSizeGB: .1

The clusterRole: shardsvr section tells mongod that the node can be used in a sharded cluster.

The cacheSizeGB: .1 section restricts the memory usage of each running mongod. Note that this is not good practice. However, in order to run a sharded cluster inside a virtual machine with only 2GB of memory, certain adjustments must be made.

All three nodes of the m103-repl replica set will need to be restarted with sharding enabled, but given that this is a replica set, you can do this operation without any downtime. This replica set will become the primary shard in your sharded cluster.

__4. Add m103-repl as the first shard__

Once m103-repl has sharding enabled, you can add it as the primary shard with:

        sh.addShard("m103-repl/192.168.103.100:27001")

Check the output of sh.status() to make sure it's included as a shard.

Now run the validation script in your vagrant and outside the mongo shell and enter the validation key you receive below. If you receive an error, it should give you some idea of what went wrong.

        vagrant@m103:~$ validate_lab_first_sharded_cluster

Solution:

        5a57de1cb1575291ce6e560a

***See detailed answer***

__1. Bring up the config server replica set (CSRS)__

Here are the remaining two config files for m103-csrs:

CSRS Node 2:

        sharding:
            clusterRole: configsvr
        replication:
            replSetName: m103-csrs
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26002
        systemLog:
            destination: file
            path: /var/mongodb/db/csrs2.log
            logAppend: true
        processManagement:
            fork: true
        storage:
            dbPath: /var/mongodb/db/csrs2

CSRS Node 3:

        sharding:
            clusterRole: configsvr
        replication:
            replSetName: m103-csrs
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        net:
            bindIp: localhost,192.168.103.100
            port: 26003
        systemLog:
            destination: file
            path: /var/mongodb/db/csrs3.log
            logAppend: true
        processManagement:
            fork: true
        storage:
            dbPath: /var/mongodb/db/csrs3

Once all three mongod processes are running, we can bring up m103-csrs just like any other replica set.

__2. Bring up the mongos__

Once we have the config file for our mongos process (mongos.conf), we can navigate to the directory where it is located and bring up the mongos:

        mongos -f mongos.conf

No further configuration of mongos is required for this lab.

__3. Reconfigure m103-repl__

Here are the updated config files for the three nodes in m103-repl:

Node 1:

        storage:
            dbPath: /var/mongodb/db/1
            wiredTiger:
                engineConfig:
                    cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27001
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/mongod1/mongod.log
            logAppend: true
        processManagement:
            fork: true
        operationProfiling:
            slowOpThresholdMs: 50
        replication:
            replSetName: m103-repl
        sharding:
            clusterRole: shardsvr

Node 2:

        storage:
            dbPath: /var/mongodb/db/2
            wiredTiger:
                engineConfig:
                    cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27002
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/mongod2/mongod.log
            logAppend: true
        processManagement:
            fork: true
        operationProfiling:
            slowOpThresholdMs: 50
        replication:
            replSetName: m103-repl
        sharding:
            clusterRole: shardsvr

Node 3:

        storage:
            dbPath: /var/mongodb/db/3
            wiredTiger:
                engineConfig:
                    cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27003
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/mongod3/mongod.log
            logAppend: true
        processManagement:
            fork: true
        operationProfiling:
            slowOpThresholdMs: 50
        replication:
            replSetName: m103-repl
        sharding:
            clusterRole: shardsvr

Once all three mongod processes are restarted, m103-repl is enabled for sharding.

__4. Add m103-repl as the first shard__

From the mongo shell of our mongos, we can run the following command to add our replica set as a shard in this cluster:

        sh.addShard("m103-repl/192.168.103.100:27001")

Note that we only need to specify one node in the replica set of our new shard. The response of this command should contain something like this:

        {
            "shardAdded" : "m103-repl"
        }

Running sh.status() should show our new shard in the cluster:

        shards:
            {  "_id" : "m103-repl",  "host" : "m103-repl/192.168.103.100:27001,192.168.103.100:27002,192.168.103.100:27003",  "state" : 1 }

From this point onward, all CRUD operations will go through mongos. We need not connect to individual shards, as mongos will route our queries for us.

## 3.4 Config DB

### Lecture Instructions

Switch to config DB:

        use config

Query config.databases:

        db.databases.find().pretty()

Query config.collections:

        db.collections.find().pretty()

Query config.shards:

        db.shards.find().pretty()

Query config.chunks:

        db.chunks.find().pretty()

Query config.mongos:

        db.mongos.find().pretty()

### Quiz

When should you manually write data to the Config DB?

- [x] When directed to by MongoDB documentation or Support Engineers
- [ ] When removing a shard
- [ ] When importing a new dataset
- [ ] When adding a shard
- [ ] When sharding a collection

***See detailed answer***

The config database is used and maintained internally by MongoDB, and you shouldn't write to it unless directed to by MongoDB Documentation or Support Engineers.

## 3.5 Shard Keys

### Lecture Instructions

Show collections in m103 database:

        use m103
        show collections

Enable sharding on the m103 database:

        sh.enableSharding("m103")

Find one document from the products collection, to help us choose a shard key:

        db.products.findOne()

Create an index on sku:

        db.products.createIndex( { "sku" : 1 } )

Shard the products collection on sku:

        sh.shardCollection("m103.products", {"sku" : 1 } )

Checking the status of the sharded cluster:

        sh.status()

### Quiz

True or False: Shard keys are mutable.

- [ ] True
- [x] False

***See detailed answer***

Shard keys are immutable. Furthermore, their values are also immutable. Sharding is a permanent operation.

## 3.6 Picking a Good Shard Key

### Quiz

Which of the following are indicators that a field or fields are a good shard key choice?

- [ ] Indexed
- [x] Low Frequency
- [ ] Monotonic change
- [x] Non-monotonic change
- [x] High Cardinality
  
***See detailed answer***

__Correct answers:__

- __High Cardinality__

High cardinality provides more shard key values, which determines the maximum number of chunks the balancer can create.

- __Non-monotonic change__

If the shard key value monotonically increased, all new inserts would be routed to the chunk with maxKey as the upper bound.

- __Low Frequency__

High frequency means that most documents fall within a particular range. If the majority of documents contain only a subset of the possible shard key values, then the chunks storing those documents become a bottleneck within the cluster.

__Incorrect answers:__

- __Monotonic change__

Monotonically changing shard keys result in write operations going to a single shard, and are not performant.

- __Indexed__

Shard key fields must be indexed, so that doesn't necessarily mean that they are a good shard key choice.

## 3.7 Hashed Shard Keys

### Quiz

Which of the following functions does Hashed Sharding support?

- [ ] Even distribution of a monotonically changing shard key field in a compound index
- [x] Even distribution of a monotonically changing shard key field
- [ ] Fast sorts on the shard key
- [ ] Targeted queries on a range of shard key values

***See detailed answer***

__Correct answers:__

- __Even distribution of a monotonically changing shard key field__

The hash function will scramble shard key values, so values adjacent to each other may be very different after going through the hash function.

__Incorrect answers:__

- __Targeted queries on a range of shard key values__

We are less likely to get targeted queries on ranges of shard key values.

- __Even distribution of a monotonically changing shard key field in a compound index__

You cannot create a hashed index on multiple fields.

- __Fast sorts on the shard key__

Sorts are slower on a hashed index than a normal index.

## Lab - Shard a Collection

### Problem

At this point, your cluster is now configured for sharding. You should already have a CSRS, mongos, and primary shard.

In this lab, you will do the following with your cluster:

1. Add a second shard
2. Import a dataset onto your primary shard
3. Choose a shard key and shard your collection

__1. Adding a Second Shard__

Your second shard m103-repl-2 will be a three-node replica set, just like your primary shard.

You can create the data paths for each node in m103-repl-2 with the following command:

        mkdir /var/mongodb/db/{4,5,6}

Here are the config files for this replica set:

Node 4:

        storage:
            dbPath: /var/mongodb/db/4
            wiredTiger:
                engineConfig:
                    cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27004
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/4/mongod.log
            logAppend: true
        processManagement:
            fork: true
        operationProfiling:
            slowOpThresholdMs: 50
        replication:
            replSetName: m103-repl-2
        sharding:
            clusterRole: shardsvr

Node 5:

        storage:
            dbPath: /var/mongodb/db/5
            wiredTiger:
                engineConfig:
                    cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27005
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/5/mongod.log
            logAppend: true
        processManagement:
            fork: true
        operationProfiling:
            slowOpThresholdMs: 50
        replication:
            replSetName: m103-repl-2
        sharding:
            clusterRole: shardsvr

Node 6:

        storage:
            dbPath: /var/mongodb/db/6
            wiredTiger:
                engineConfig:
                    cacheSizeGB: .1
        net:
            bindIp: 192.168.103.100,localhost
            port: 27006
        security:
            keyFile: /var/mongodb/pki/m103-keyfile
        systemLog:
            destination: file
            path: /var/mongodb/db/6/mongod.log
            logAppend: true
        processManagement:
            fork: true
        operationProfiling:
            slowOpThresholdMs: 50
        replication:
            replSetName: m103-repl-2
        sharding:
            clusterRole: shardsvr

We can now initialize m103-repl-2 as a normal replica set.

Now exit the mongo shell and connect to mongos. We can add m103-repl-2 as a shard with the following command:

        sh.addShard("m103-repl-2/192.168.103.100:27004")

The output of sh.status() should now reflect the new shard.

__2. Importing Data onto the Primary Shard__

The dataset products.json is contained in your Vagrant box, in the /dataset/ directory. You can import this dataset into mongos with the following command:

        mongoimport --drop /dataset/products.json --port 26000 -u "m103-admin" \
        -p "m103-pass" --authenticationDatabase "admin" \
        --db m103 --collection products

You can verify that the entire dataset was imported by querying the m103 database on mongos. The collection products should contain exactly 516784 documents.

__3. Sharding the Collection__

Before you can shard your new products collection, you must enable sharding on the m103 database:

        sh.enableSharding("m103")

Once you've done this, it's time to choose a shard key on a single field in the products collection. To do this, you should review the qualities of a good shard key in the docs and the following information about the products collection:

- _id is a serial number for each product in this collection, rarely used in queries but important for internal MongoDB usage
- sku (Stock Keeping Unit) is a randomly generated integer unique to each product - this is commonly used to refer to specific products when updating stock quantities
- name is the name of the product as it appears in the store and on the website
- type is the type of product, with the possible values "Bundle", "Movie", "Music" and "Software"
- regularPrice is the regular price of the product, when there is no sale - this price changes every season
- salePrice is the price of a product during a sale - this price changes arbitrarily based on when sales occur
- shippingWeight is the weight of the product in kilograms, ranging between 0.01 and 1.00 - this value is not known for every product in the collection
If you want a better understanding of the distribution and the nature of the fields and their types, you can do so using Compass.

Once you've chosen a shard key, you must create an index on the shard key field:

        db.products.createIndex({"<shard_key>": 1})

Once the index is created, shard the collection with the following command:

        db.adminCommand( { shardCollection: "m103.products", key: { <shard_key>: 1 } } )

__Choosing the Correct Shard Key__

Now run the validation script in your vagrant and outside the mongo shell and enter the validation key you receive below:

        vagrant@m103:~$ validate_lab_shard_collection

If you chose the wrong shard key, the validation script will give you an error. However, if you already imported the dataset, you must drop the collection and reimport it in order to choose a different shard key.

Solution:

        5a621149d083824c6d889865

***See detailed answer***

__1. Adding a Second Shard__

Once m103-repl-2 is up and running, we exit the mongo shell and connect to mongos. We can add our new shard with the following command:

        sh.addShard("m103-repl-2/192.168.103.100:27004")

The output of sh.status() should look something like this:

        shards:
            {  "_id" : "m103-repl",  "host" : "m103-repl/192.168.103.100:27001,192.168.103.100:27002,192.168.103.100:27003",  "state" : 1 }
            {  "_id" : "m103-repl-2",  "host" : "m103-repl-2/192.168.103.100:27004,192.168.103.100:27005,192.168.103.100:27006",  "state" : 1 }

__2. Importing Data onto the Primary Shard__

Importing data into a sharded cluster is always done with the mongos. We can import our dataset into m103.products with the following command:

        mongoimport /dataset/products.json --port 26000 -u "m103-admin" \
        -p "m103-pass" --authenticationDatabase "admin" \
        --db m103 --collection products

We can verify that the entire dataset was imported with count():

        use m103
        db.products.count()

This should return 516784.

__3. Sharding the Collection__

We can look at all potential shard keys with findOne():

        use m103
        db.products.findOne()

The output of this command should give us something like this:

        {
            "_id" : ObjectId("573f706ff29313caab7d7395"),
            "sku" : 1000000749,
            "name" : "Gods And Heroes: Rome Rising - Windows [Digital Download]",
            "type" : "Software",
            "regularPrice" : 39.95,
            "salePrice" : 39.95,
            "shippingWeight" : "0.01"
        }

A trick to determining the correct shard key is process of elimination. We can rule out the potential shard keys which don't follow the rules of cardinality, frequency, rate of change, and query patterns.

We can rule out _id because it is rarely used in queries, and we would therefore be wasting an index by sharding on it. In addition, it is monotonically increasing, so it will continue to increase forever and cause hotspotting in our cluster.

We can rule out type because this field does not have high cardinality. In fact, it only has four possible values - we can see this by running the following command on m103.products:

        db.products.distinct("type")

We can rule out regularPrice and salePrice because they are both subject to change and the shard key is immutable. If we sharded on one of these fields, any future updates to that field would result in an error.

We can rule out shippingWeight because every document in the collection must have the shard key, and not every document here has a shippingWeight.

From this, we have only two good shard keys:

- name
- sku

Both of these fields have high cardinality, low frequency and non-monotonically increasing values. They are also commonly used in queries.

The validation script will accept either solution.

Before we can shard, we must enable sharding on the m103 database:

        sh.enableSharding("m103")

Then, we must create an index on the shard key (in this example, name):

        db.products.createIndex({"name": 1})

To shard on name, we specify the collection:

        db.adminCommand( { shardCollection: "m103.products", key: { name: 1 } } )

__Choosing the Correct Shard Key__

To choose a different shard key, the collection must be dropped and the dataset must be reimported.

From the mongos shell, we can drop the products collection with the following command:

        use m103
        db.products.drop()

Now we exit the mongos shell and reimport the dataset:

        mongoimport /dataset/products.json --port 26000 -u "m103-admin" \
        -p "m103-pass" --authenticationDatabase "admin" \
        --db m103 --collection products

Now we can shard the collection again, because the dataset gets imported onto the primary shard.

## 3.8 Chunks

### Lecture Instructions

Show collections in config database:

        use config
        show collections

Find one document from the chunks collection:

        db.chunks.findOne()

Change the chunk size:

        use config
        db.settings.save({_id: "chunksize", value: 2})

Check the status of the sharded cluster:

        sh.status()

Download the attached handout products.part2.json and copy this file to your Vagrant shared folder:

        cp ~/Downloads/products.part2.json m103-vagrant-env/shared/.

Import a new dataset (note that this dataset does not exist on the course VM):

        mongoimport -d m103 -c products /shared/products.part2.json

### Quiz

What is true about chunks?

- [ ] Jumbo chunks can be migrated between shards.
- [ ] Documents in the same chunk may live on different shards.
- [x] Chunk ranges have an inclusive minimum and an exclusive maximum
- [ ] Chunk ranges can never change once they are set.
- [x] Increasing the maximum chunk size can help eliminate jumbo chunks.

***See detailed answer***

__Correct answers:__

- __Chunk ranges have an inclusive minimum and an exclusive maximum.__

This is how chunk ranges are defined in MongoDB.

- __Increasing the maximum chunk size can help eliminate jumbo chunks.__

By definition, jumbo chunks are larger than the maximum chunk size, so raising the max chunk size can get rid of them.

__Incorrect answers:__

- __Chunk ranges can never change once they are set.__

The cluster may split chunks once they become too big.

- __Documents in the same chunk may live on different shards.__

Individual chunks always remain on the same shard.

- __Jumbo chunks can be migrated between shards.__

Jumbo chunks cannot be migrated to another shard, which is part of the reason why they are so problematic.

## Lab - Documents in Chunks

### Problem

__Lab Prerequisites__

This lab assumes that the m103.products collection is sharded on sku. If you sharded on name instead, you must reimport the dataset and shard it on sku. Here are the instructions to do this:

1. Drop the collection m103.products and reimport the dataset:

        mongoimport --drop /dataset/products.json --port 26000 -u "m103-admin" \
        -p "m103-pass" --authenticationDatabase "admin" \
        --db m103 --collection products

2. Create an index on sku:

    db.products.createIndex({"sku":1})

3. Enable sharding on m103 if not enabled:

        sh.enableSharding("m103")

4. Shard the collection on sku:

        db.adminCommand({shardCollection: "m103.products", key: {sku: 1}})

Once you've sharded your cluster on sku, any queries that use sku will be routed by mongos to the correct shards.

__Lab Description__

In this lab, you are going to use the sharded cluster you created earlier in this lesson and derive which chunk a given document resides.

Connect to the mongos and authenticate as the m103-admin user you created in an earlier lab.

Once connected, execute the following operation:

        db.getSiblingDB("m103").products.find({"sku" : 21572585 })

Locate the chunk that the specified document resides on and pass the full chunk ID to the validation script provided in the handout. You need to run the validation script in your vagrant and outside the mongo shell.

hint sh.status() does not provide the chunk ID that you need to report for this lab. Look in the config database for the collection that stores all chunk information. Think in ranges - you want to find the chunk whose range is min <= key < max.

        vagrant@m103:~$ validate_lab_document_chunks <chunk-id>

Enter the validation key you receive below. The script returns verbose errors that should provide you with guidance on what went wrong.

Solution:

        5ac28a604c7baf1f5c25d51b

***See detailed answer***

First, connect to the mongos as the m103-admin user:

        mongo -u m103-admin -p mypass123 --authenticationDatabase admin --port 26000

Use sh.status() to confirm that the products collection is sharded on sku.

Because the values of our shard key are normal integers, it is possible to visually identify which chunk our document belongs in. However, sh.status() does not provide the chunk ID necessary.

Query the config.chunks collection to identify which chunk contains the document in question. First, ensure you are filtering only those chunks belonging to the m103.products namespace:

        db.getSiblingDB("config").chunks.find(
            {
                "ns" : "m103.products"
            }
        )

The result of this query is all chunks associated to the sharded products collection. We can visually identify which chunk our document belongs in by looking at the min.sku and max.sku fields, which define the inclusive minimum and exclusive maximum range of shard key values that are associated to the chunk.

However, for larger datasets, there may be many hundreds or thousands of chunks, making visual identification time consuming or unrealistic. Instead, we can perform a query against the config.chunks database to identify the chunk where min <= sku < max

        db.getSiblingDB("config").chunks.find(
            {
                "ns" : "m103.products",
                $expr: {
                    $and : [
                    {$gte : [ 21572585, "$min.sku"]},
                    {$lt : [21572585, "$max.sku"]}
                    ]
                }
            }
        )

$expr allows us to use aggregation operators and syntax in normal queries. Without $expr, we would not be able to use the $min.sku and $max.sku variable expressions to represent the value of min or max for any given product. The query returns the single chunk where the document resides:

        {
            "_id" : "m103.products-sku_19765188",
            "ns" : "m103.products",
            "min" : {
                "sku" : 19765188
            },
            "max" : {
                "sku" : 22935319
            },
            "shard" : "shard2",
            "lastmod" : Timestamp(1, 4),
            "lastmodEpoch" : ObjectId("5a6103511d9376be96849296")
        }

The _id field's value is the chunk ID needed for this lab.

## 3.9 Balancing

### Lecture Instructions

Start the balancer:

        sh.startBalancer(timeout, interval)

Stop the balancer:

        sh.stopBalancer(timeout, interval)

Enable/disable the balancer:

        sh.setBalancerState(boolean)

### Quiz

Given a sharded cluster running MongoDB 3.6, which of the shard components is responsible for running the Balancer process?

- [ ] Mongos
- [x] Primary node of the Config Server Replica Set
- [ ] Primary of each Shard Replica Set
- [ ] Secondary of the Config Server Replica Set

***See detailed answer***

Only the Primary of the CSRS is responsible for running the balancer process. Neither the secondary CSRS members nor any of the shards are responsible for the balancer process.


## 3.10 Queries in a Sharded Cluster

### Quiz

For a find() operation, which cluster component is responsible for merging the query results?

- [ ] None, the results are coming out in the right order from the shards
- [ ] The primary member of each shard
- [x] The mongos that issued the query
- [ ] The primary member of the config server replica set
- [ ] A randomly chosen shard in the cluster

***See detailed answer***

The mongos is responsible for merging the results of a standard find operation.

## 3.11 Routed Queries vs Scatter Gather: Part 2

### Lecture Instructions

Show collections in the m103 database:

        use m103
        show collections

Routed query with explain() output:

        db.products.find({"sku" : 1000000749 }).explain()

Scatter gather query with explain() output:

        db.products.find( {
            "name" : "Gods And Heroes: Rome Rising - Windows [Digital Download]" }
        ).explain()

### Quiz

Given the following shard key, which of the following queries results in a targeted query?

        { "sku" : 1, "name" : 1 }

- [x] `db.products.find( { "name" : "MongoHacker", "sku" : 1337 } )`
- [ ] `db.products.find( { "sku" : 1337 } )`
- [x] `db.products.find( { "name" : "MongoHacker" } )`
- [x] `db.products.find( { "sku" : 1337, "name" : "MongoHacker" } )`

***See detailed answer***

__Correct answers:__

- `db.products.find( { "sku" : 1337, "name" : "MongoHacker" } ), db.products.find( { "name" : "MongoHacker", "sku" : 1337 } )`

These two queries are actually identical, and can both be targeted using the shard key.

- `db.products.find( { "sku" : 1337 } )`

This query includes the sku prefix and can therefore be targeted.

__Incorrect answers:__

- `db.products.find( { "name" : "MongoHacker" } )`

This query doesn't include the sku prefix, and cannot be targeted.

## Lab - Detect Scatter Gather Queries

### Problem

__Lab Prerequisites__

This lab assumes that the m103.products collection is sharded on sku. If you sharded on name instead, you must reimport the dataset and shard it on sku. Here are the instructions to do this:

1. Drop the collection m103.products and reimport the dataset:

        mongoimport --drop /dataset/products.json --port 26000 -u "m103-admin" \
        -p "m103-pass" --authenticationDatabase "admin" \
        --db m103 --collection products

2. Create an index on sku:

        db.products.createIndex({"sku":1})

3. Enable sharding on m103 if not enabled:

        sh.enableSharding("m103")

4. Shard the collection on sku:

        db.adminCommand({shardCollection: "m103.products", key: {sku: 1}})

Once you've sharded your cluster on sku, any queries that use sku will be routed by mongos to the correct shards.

__Lab Description__

In this lab, you will use the output of the explain() command to distinguish between targeted queries (sent to specific shards) and scatter gather queries (sent to all shards).

Here are a few definitions regarding the output of explain():

- SHARDING_FILTER: The step performed by mongos used to make sure that documents fetched from a particular shard are supposed to be from that shard. To do this, mongos compares the shard key of the document with the metadata on the config servers.
- IXSCAN: An index scan, used to scan through index keys.
- FETCH: A document fetch, used to retrieve an entire document because one or more of the fields is necessary.
You can find more information about explain() in the official MongoDB documentation.

Now, given the explain() output of the following two queries:

__Query 1:__

        db.products.explain("executionStats").find({"sku": 23153496})

__Query 2:__

        db.products.explain("executionStats").find({"shippingWeight": 1.00})

Assuming the only indexes on this collection are { _id: 1 } and { sku: 1 }, which of the following statements are true?

- [x] Query 2 performs a collection scan.
- [ ] Query 2 uses the shard key.
- [x] Query 1 performs an index scan before the sharding filter.

***See detailed answer***

__Correct Answers:__

- __Query 1 performs an index scan before the sharding filter.__

The sharding filter ensures that documents returned by each shard are not orphan documents. It does this by comparing the value of the shard key to the chunk ranges inside that particular shard.

Mongos will try to minimize the number of documents checked by the shard filter. To do this, mongos will only send the documents matching the query (i.e. are returned by the index scan) to be compared against the chunk ranges.

- __Query 2 performs a collection scan.__

Assuming there is no index on shippingWeight, then Query 2 would need to perform a collection scan.

__Incorrect Answers:__

- __Query 2 uses the shard key.__

We know that Query 2 doesn't use the shard key because the shard key is not in the query predicate.

# Lectures

- [MongoDB Sharding docs](https://docs.mongodb.com/manual/tutorial/manage-sharded-cluster-balancer/#sharding-schedule-balancing-window)
- [explain()](https://docs.mongodb.com/manual/reference/explain-results/)