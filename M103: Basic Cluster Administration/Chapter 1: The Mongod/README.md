# Chapter 1: The Mongod

## 1.1 The Mongod

### Lecture Notes

You can read more about the MongoDB server in the daemon documentation.

Note: The --fork option is not available on the Windows operating system.

### Lecture Instructions

Connect to the vagrant box:

        cd m103-vagrant-env
        vagrant ssh

Launch mongod in our first shell:

        mongod

Connect to the Mongo shell in our second shell:

        mongo

Shutdown mongod from our second shell:

        mongo admin --eval 'db.shutdownServer()'

Find command line options for mongod:

        mongod --help

Create new data directory and try to launch mongod with a new port and dbpath, and also fork the process:

        mkdir first_mongod
        mongod --port 30000 --dbpath first_mongod --fork

The above command will fail without a logpath - so we add one and then successfully launch mongod:

        mongod --port 30000 --dbpath first_mongod --logpath first_mongod/mongod.log --fork

Try to connect back to Mongo shell, without specifying a port:

        mongo

We need to add a port, because our mongod is running on port 30000, not the default 27017:

        mongo --port 30000

Shutdown the new server:

        mongo admin --port 30000 --eval 'db.shutdownServer()'


### Quiz

Problem:

When specifying the --fork argument to mongod, what must also be specified?

- [x] --logpath
- [ ] --logfile
- [ ] --logdestination
- [ ] --loglocation
  
***See detailed answer***

Typically the mongod will send logs to standard output, or the terminal window.

But the --fork option tells mongod to run in the background, so mongod has to write logs to a file instead.

We specify the file for these logs with the --logpath option.

## 1.2 MongoDB Architecture

### Quiz

Problem:

Sharded clusters are composed of:

- [x] Replica Sets
- [x] Mongos
- [ ] Load Balancer
- [x] Config Servers

***See detailed answer***

- __Mongos__

Correct, mongos routes all the requests from client applications. This is an important component of a MongoDB shard cluster.

- ___Config Servers___

Correct, the config servers are essential components of a shard cluster. They hold all the metadata about each shard.

- ___Replica Sets___

Correct, each shard node is a replica set.

- ___Load Balancer___

Incorrect, load balancer is not used in a shard cluster. There is internal data and consequent load balancing amongst the shard nodes, however we have no component called load balancer or a specific node that will do that task specifically.

## 1.3 Data Structures

### Quiz

Problem:

Which of the following is true about indexes?

- [ ] Indexes speed up our write operations.
- [ ] By default, MongoDB doesn't create any indexes.
- [x] Indexes take up space in memory.
- [x] Indexes speed up our read operations.

***See detailed answer***

Correct answers:

- ___Indexes speed up our read operations.___

Indexes speed up read operations by organizing our data, making it easier to traverse.

- ___Indexes take up space in memory.___

Indexes are stored in memory, so they're fast but we need to be mindful about how many indexes we need.

Incorrect answers:

- ___By default, MongoDB doesn't create any indexes.___

MongoDB will automatically create an index on the _id field when a new collection is created.

- ___Indexes speed up our write operations.___

Indexes slow down write operations because new index keys must be created and stored for every new document.

## 1.4 Configuration File

### Lecture Notes

See MongoDB documentation for more information about [command line options](https://docs.mongodb.com/manual/reference/program/mongod/#options) and [configuration file options](https://docs.mongodb.com/manual/reference/configuration-options/).

### Lecture Instructions

These lecture instructions are not meant to be reproduced in your environment. They reflect what you will see in the lecture video, however they may point to non-existing resources and files.

Launch mongod using default configuration:

        mongod

Launch mongod with specified --dbpath and --logpath:

        mongod --dbpath /data/db --logpath /data/log/mongod.log

Launch mongod and fork the process:

        mongod --dbpath /data/db --logpath /data/log/mongod.log --fork

Launch mongod with many configuration options:

        mongod --dbpath /data/db --logpath /data/log/mongod.log --fork --replSet "M103" --keyFile /data/keyfile --bind_ip "127.0.0.1,192.168.0.100" --sslMode requireSSL --sslCAFile "/etc/ssl/SSLCA.pem" --sslPEMKeyFile "/etc/ssl/ssl.pem"

Example configuration file, with the same configuration options as above:

        storage:
            dbPath: "/data/db"
        systemLog:
            path: "/data/log.mongod.log"
            destination: "file"
        replication:
            replSetName: M103
        net:
            bindIp : "127.0.0.1,192.168.0.100"
        ssl:
            mode: "requireSSL"
            PEMKeyFile: "/etc/ssl/ssl.pem"
            CAFile: "/etc/ssl/SSLCA.pem"
        security:
            keyFile: "/data/keyfile"
        processManagement:
            fork : true

### Quiz

Problem:

Consider the following:

        mongod --dbpath /data/db --logpath /data/logs --replSet M103 --bind_ip '127.0.0.1,192.168.0.100' --keyFile /data/keyfile --fork

Which of the following represents a configuration file equivalent to the command line options?

- [x] Option 1:
  
       storage:
            dbPath: "/data/db"
        systemLog:
            destination: file
            path: "/data/logs"
        replication:
            replSetName: "M103"
        net:
            bindIp: "127.0.0.1,192.168.0.100"
        security:
            keyFile: "/data/keyfile"
        processManagement:
            fork: true

- [ ] Option 2:

        storage
            dbPath="/data/db"
        systemLog
            destination="/data/logs"
        replication
            replSetName="M103"
        net
            bindIp="127.0.0.1,192.168.0.100"
        security
            keyFile="/data/keyfile"
        processManagement
            fork=true

- [ ] Option 3

        storage.dbPath: /data/db
        systemLog.destination: "/data/logs"
        replication.replSetName: "M103"
        net.bindIp: "127.0.0.1,192.168.0.100"
        security.keyFile: "/data/keyfile"
        processManagement.fork: true

***See detailed answer***

This is the correct answer:

        storage:
            dbPath: "/data/db"
        systemLog:
            destination: file
            path: "/data/logs"
        replication:
            replSetName: "M103"
        net:
            bindIp: "127.0.0.1,192.168.0.100"
        security:
            keyFile: "/data/keyfile"
        processManagement:
            fork: true

This answer does not use the correct syntax - the separation between a key and its value should be a colon.

        storage
            dbPath="/data/db"
        systemLog
            destination="/data/logs"
        replication
            replSetName="M103"
        net
            bindIp="127.0.0.1,192.168.0.100"
        security
            keyFile="/data/keyfile"
        processManagement
            fork=true

This answer does not use the correct syntax or structure.

        storage.dbPath: /data/db
        systemLog.destination: "/data/logs"
        replication.replSetName: "M103"
        net.bindIp: "127.0.0.1,192.168.0.100"
        security.keyFile: "/data/keyfile"
        processManagement.fork: true

## Lab - Launching Mongod

### Problem

In this lab, you're going to launch your own mongod with a few basic command line arguments.

Applying what you've learned so far about the mongod process, launch a mongod instance, from the command line, with the following requirements:

- run on port 27000
- data files are stored in /data/db/
- listens to connections from the IP address 192.168.103.100 and localhost
- authentication is enabled

By default, a mongod that enforces authentication but has no configured users only allows connections through the localhost. Use the mongo shell on the Vagrant box to use the localhost exception and connect to this node.

Use the following command to connect to the Mongo shell and create the following user. You will need this user in order to validate subsequent labs.

        mongo admin --host localhost:27000 --eval '

        db.createUser({
            user: "m103-admin",
            pwd: "m103-pass",
            roles: [
            {role: "root", db: "admin"}
            ]
        })
        '

The above command creates a user with the following credentials:

- Role: root on admin database
- Username: m103-admin
- Password: m103-pass

When you're finished, run the following validation script in your vagrant and outside the mongo shell and enter the validation key you receive below. If you receive an error, it should give you some idea of what went wrong.

        vagrant@m103:~$ validate_lab_launch_mongod

Hint: You want to make sure all applicable command line options are set! Also, in case you need to restart the mongod daemon, you may need to kill the process using it's pid.

You can use the following command to find the pid of the process:

        ps -ef | grep mongod

To kill the process, you can use this command:

        kill <pid>

Solution:

        5a21c6dd403b6546001e79c0

***See detailed answer***

In order to complete this lab, we first must properly configure our mongod. Here is a command that fulfills the requirements of the lab:

        mongod --port 27000 --dbpath /data/db --auth --bind_ip 192.168.103.100,127.0.0.1

Let's go through these command line options:

- --port 27000 tells mongod to run on port 27000, which means we have to connect to mongo on that port.
- --dbpath /data/db tells mongod to store data files in the /data/db directory. This directory must exist before we start mongod, or we will receive an error.
- --auth enables access control on our deployment. This requires users to identify themselves before connecting - we will learn how to create users below.
- --bind_ip 192.168.103.100,127.0.0.1 tells mongod to bind to the IP addresses 192.168.103.100 and 127.0.0.1 when listening for connections. --bind_ip 192.168.103.100,localhost would also work, as the name localhost resolves to 127.0.0.1.

After configuring mongod, we can connect to mongo by simply specifying a port:

        mongo --port 27000

We don't have to specify a --host here, because the default host is 127.0.0.1, or localhost. We will need to connect to localhost in order to complete the next part of the lab!

Once our mongod is running with the correct settings, we must create the first user on our database, as instructed. Because we don't have any users yet, but access control is enabled, we leverage the localhost exception to create our first user. This user must be able to create other users because we can only use this exception once. Luckily, our user has the role root and can create other users:

        use admin
        db.createUser({
            user: "m103-admin",
            pwd: "m103-pass",
            roles: [
                {role: "root", db: "admin"}
            ]
        })

Notice that we can only use the localhost exception if we're connected to the admin database. If the user creation was successful, we should receive a message that says Successfully added user.

## Lab - Configuration File

###Problem

In this lab, you're going to launch a mongod instance in the vagrant environment with the same exact settings as the previous lab. However this time, those settings will be defined in a configuration file instead of the command line. It is required for this lab that you use the YAML format to construct this config file.

As a reminder, here are the requirements of your mongod instance:

- run on port 27000
- data files are stored in /data/db/
- listens to connections from the IP address 192.168.103.100 and localhost
- authentication is enabled

If you created the user from the previous lab, you don't need to create any new users. If you did not create the user, do so now. Here are the requirements for that user:

- Role: root on admin database
- Username: m103-admin
- Password: m103-pass.

When your config file is complete, launch mongod with the --config <config_filepath> command line option with the filepath to your config file in place of config_filepath (you can also use the -f option instead of --config).

When you're finished, run the following validation script in your vagrant and outside the mongo shell and enter the validation key you receive below. If you receive an error, it should give you some idea of what went wrong.

        vagrant@m103:~$ validate_lab_configuration_file

Solution:

        5a2f0e41ae3c4e2f7427ee8f

***See detailed answer***

The configuration for this mongod is the same as the previous lab, but the settings should be passed in a configuration file instead of the command line. Here is an example of a valid config file for this lab:

        storage:
            dbPath: /data/db
        net:
            bindIp: 192.168.103.100,localhost
            port: 27000
        security:
            authorization: enabled

Again, localhost is an alias for 127.0.0.1, so they can be used interchangeably.

## 1.5 File Structure

### Quiz

Which of the following files in the MongoDB data directory can you access to view collection data?

- [ ] The collection.wt file
- [ ] The storage.bson file
- [ ] The WiredTiger.wt file
- [x] None of the above

***See detailed answer***

The correct answer is none of the above. You should never access the data files directly.

## Lab - Change the Default DB Path

### Problem

In this lab, you're going to edit the config file from the previous lab to include a different DB path than the default path /data/db. Mongod will now store data files in this new directory instead.

Using what you know about the configuration file and Linux user groups, please complete the following:

- create a new folder /var/mongodb/db/ and allow mongod to write files to this directory
create this directory with sudo, because /var is owned by root
use chown to change the owner of this directory to vagrant:vagrant

- edit your config file to use this new directory as the dbpath

Here are the updated requirements for your mongod instance:

- runs on port 27000
- stores its data files in /var/mongodb/db/
- listens to connections from the IP address 192.168.103.100 and localhost
- uses authentication

Now that your config file has changed, you have to restart mongod so the server will reflect those changes. As a reminder, here is the way to safely shutdown from the mongo shell:

        use admin
        db.shutdownServer()
        quit()

Once your mongod is safely stopped, you can launch it again with your new config file.

We could have kept the previous DB and users, however in this lab we will start with a new empty database directory, meaning empty database.

Let's recreate the user m103-admin with the same requirements as earlier, as we will need this user for the validation scripts and later tasks.

- Role: root on admin database
- Username: m103-admin
- Password: m103-pass

When you're finished, run the following validation script in your vagrant and outside the mongo shell and enter the validation key you receive below. If you receive an error, it should give you some idea of what went wrong.

        vagrant@m103:~$ validate_lab_change_dbpath

Solution:

        5a2f973bcb6b357b57e6bf43

***See detailed answer***

Because /var/ is owned by root, we have to create the subdirectory /var/mongodb/db/ as root:

        sudo mkdir -p /var/mongodb/db

However, in order to use /var/mongodb/db/ as the dbpath, it must allow write access by the user running mongod. We can accomplish this by changing the owner of our new directory to vagrant:

        sudo chown vagrant:vagrant /var/mongodb/db

Now we can edit our configuration file to use this new directory as the DB path:

        storage:
            dbPath: /var/mongodb/db/
        net:
            bindIp: 192.168.103.100,localhost
            port: 27000
        security:
            authorization: enabled

Start the mongod process with:

        mongod -f mongod.conf

The process of creating this user is identical to the previous labs, but we have to repeat it for our new DB path:

        use admin
        db.createUser({
            user: "m103-admin",
            pwd: "m103-pass",
            roles: [
               {role: "root", db: "admin"}
            ]  
        })

## 1.6 Basic Commands

### Lecture Instructions

User management commands:

        db.createUser()
        db.dropUser()

Collection management commands:

        db.<collection>.renameCollection()
        db.<collection>.createIndex()
        db.<collection>.drop()

Database management commands:

        db.dropDatabase()
        db.createCollection()

Database status command:

        db.serverStatus()

Creating index with Database Command:

        db.runCommand(
            { "createIndexes": <collection> },
            { "indexes": [
                {
                    "key": { "product": 1 }
                },
                { "name": "name_index" }
                ]
            }
        )

Creating index with Shell Helper:

        db.<collection>.createIndex(
            { "product": 1 },
            { "name": "name_index" }
        )

Introspect a Shell Helper:

        db.<collection>.createIndex

### Quiz

Which of the following methods executes a database command?

- [ ] db.command( { <COMMAND> } )
- [x] db.runCommand( { <COMMAND> } )
- [ ] db.runThisCommand( { <COMMAND> } )
- [ ] db.executeCommand( { <COMMAND> } )

***See detailed answer***

db.runCommand( { <COMMAND> } ) is correct. None of the other values are valid commands.

## 1.7 Logging Basics

### Lecture Instructions

Get the logging components:

        mongo admin --host 192.168.103.100:27000 -u m103-admin -p m103-pass --eval '
        db.getLogComponents()
        '
Change the logging level:

        mongo admin --host 192.168.103.100:27000 -u m103-admin -p m103-pass --eval '
        db.setLogLevel(0, "index")
        '

Tail the log file:

        tail -f /data/db/mongod.log

Update a document:

        mongo admin --host 192.168.103.100:27000 -u m103-admin -p m103-pass --eval '
        db.products.update( { "sku" : 6902667 }, { $set : { "salePrice" : 39.99} } )
        '

Look for instructions in the log file with grep:

        grep -R 'update' /data/db/mongod.log

### Quiz

Which of the following process logging components will capture the following operation, assuming a verbosity of 1 or greater?

        db.runCommand(
            {
                update: "products",
                updates: [
                {
                    q: <query>,
                    u: <update>,
                }
            }
        )

- [x] COMMAND
- [x] WRITE
- [ ] UPDATE
- [ ] QUERY

***See detailed answer***

The insert operation generates both a WRITE and COMMAND log event. There is no UPDATE component, and the QUERY component captures events related to query planning.

## 1.8 Profiling the Database

### Lecture Instructions

Get profiling level:

        mongo newDB --host 192.168.103.100:27000 -u m103-admin -p m103-pass --authenticationDatabase admin --eval '
        db.getProfilingLevel()
        '

Set profiling level:

        mongo newDB --host 192.168.103.100:27000 -u m103-admin -p m103-pass --authenticationDatabase admin --eval '
        db.setProfilingLevel(1)
        '

Show collections:

        mongo newDB --host 192.168.103.100:27000 -u m103-admin -p m103-pass --authenticationDatabase admin --eval '
        db.getCollectionNames()
        '

Note: show collections only works from within the shell

Set slowms to 0:

        mongo newDB --host 192.168.103.100:27000 -u m103-admin -p m103-pass --authenticationDatabase admin --eval '
        db.setProfilingLevel( 1, { slowms: 0 } )
        '

Insert one document into a new collection:

        mongo newDB --host 192.168.103.100:27000 -u m103-admin -p m103-pass --authenticationDatabase admin --eval '
        db.new_collection.insert( { "a": 1 } )
        '

Get profiling data from system.profile:

        mongo newDB --host 192.168.103.100:27000 -u m103-admin -p m103-pass --authenticationDatabase admin --eval '
        db.system.profile.find().pretty()
        '

### Quiz

What events are captured by the profiler?

- [ ] WiredTiger storage data
- [x] Cluster configuration operations
- [x] CRUD operations
- [ ] Network timeouts
- [x] Administrative commands

***See detailed answer***

CRUD operations, Administrative commands, and Cluster configuration operations are all captured by the database profiler.

However, Network timeouts and WiredTiger storage data are not captured by the profiler - this data is stored in the logs instead.

## Lab - Logging to a Different Facility

### Problem

By default, mongod sends diagnostic logging information to the standard output, occupying the terminal window where mongod was started. In this lab, you will tell mongod to send those logs to a file so you can fork the mongod process and continue to use the terminal window where mongod was started. You'll also change some of the default log settings.

Your task for this lab is to change the config file such that:

- mongod sends logs to /var/mongodb/db/mongod.log
- mongod is forked and run as a daemon (this will not work without a logpath)
- any query that takes 50ms or longer is logged (remember to specify this in the configuration file!)

Note: Using db.setProfilingLevel() will not work for this lab, because this command will not persist data in the config file - if the mongod process shuts down, such as during a maintenance procedure, the profiling level set with db.setProfilingLevel() will be lost.

All of the other information in your config file should stay the same as in the previous lab.

When you're finished, run the following validation script in your vagrant and outside the mongo shell and enter the validation key you receive below. If you receive an error, it should give you some idea of what went wrong.

        vagrant@m103:~$ validate_lab_different_logpath

Solution:

        5a32e5835d7a25685155aa61

***See detailed answer***

There are three different sections to add in the config file in order to complete this lab. The first is the systemLog section:

        systemLog:
            destination: file
            path: /var/mongodb/db/mongod.log
            logAppend: true

This tells mongod to send logs to a file, and specifies that file as /var/mongodb/mongod.log. logAppend: true tells mongod to append new entries to the existing log file when the mongod instance restarts.

The second section is processManagement:

        processManagement:
            fork: true

This enables a daemon that runs mongod in the background, or "forks" the process. This frees up the terminal window where mongod is launched from.

The third section is operationProfiling:

        operationProfiling:
            slowOpThresholdMs: 50

This sets the minimum threshold for a "slow" operation. Any operation that takes 50 milliseconds or longer will be logged as a result.

## 1.9 Basic Security

### Lecture Instructions

Print configuration file:

        cat /etc/mongod.conf

Launch standalone mongod:

        mongod -f /etc/mongod.conf

Connect to mongod:

        mongo --host 127.0.0.1:27017

Create new user with the root role (also, named root):

        use admin
        db.createUser({
            user: "root",
            pwd: "root123",
            roles : [ "root" ]
        })

Connect to mongod and authenticate as root:

        mongo --username root --password root123 --authenticationDatabase admin

Run DB stats:

        db.stats()

Shutdown the server:

        use admin
        db.shutdownServer()

### Quiz

When should you deploy a MongoDB deployment with security enabled?

- [x] When deploying a development environment
- [x] When deploying your production environment
- [x] When deploying an evaluation environment
- [x] When deploying your staging environment

***See detailed answer***

You should always deploy MongoDB with security enabled, regardless of the environment.

## 1.10 Built-In Roles

### Lecture Instructions

Authenticate as root user:

        mongo admin -u root -p root123

Create security officer:

        db.createUser(
            { user: "security_officer",
                pwd: "h3ll0th3r3",
                roles: [ { db: "admin", role: "userAdmin" } ]
            }
        )

Create database administrator:

        db.createUser(
            { user: "dba",
                pwd: "c1lynd3rs",
                roles: [ { db: "admin", role: "dbAdmin" } ]
            }
        )

Grant role to user:

        db.grantRolesToUser( "dba",  [ { db: "playground", role: "dbOwner"  } ] )

Show role privileges:

        db.runCommand( { rolesInfo: { role: "dbOwner", db: "playground" }, showPrivileges: true} )

### Quiz

Which of the following are Built-in Roles in MongoDB?

- [ ] readWriteUpdate
- [x] read
- [x] dbAdminAnyDatabase
- [ ] rootAll
- [ ] dbAdminAllDatabases

***See detailed answer***

__Correct Answers:__

- __dbAdminAnyDatabase__

Correct, this is a built-in role that allows users admin access to every database except local and config.

- __read__

Correct, read is a built-in role that allows users to read from designated database(s).

__Incorrect Answers:__

- __dbAdminAllDatabases, rootAll, readWriteUpdate__

None of these are built-in roles.


## Lab - Creating First Application User

### Problem

In the first lab, you created a user with the root role on the admin database. The requirements are listed here:

- run on port 27000
- data files are stored in /var/mongodb/db/
- listens to connections from the IP address 192.168.103.100 and localhost
- authentication is enabled
- root user on admin database with username: m103-admin and password: m103-pass

The root role is one of the most powerful roles in a Mongo cluster, and has many privileges which are never used by a typical application. In this lab, you will create a new user for an application that has the readWrite role, because the application does not need to monitor the cluster or create users - it only needs to read and write data.

The requirements for this new user are:

- Role: readWrite on applicationData database
- Authentication source: admin
- Username: m103-application-user
- Password: m103-application-pass

You don't need to make any changes to your mongod configuration, but it must be running with authentication enabled. If your configuration does not use authentication, this lab may fail to validate.

When you're finished, run the following validation script in your vagrant and outside the mongo shell and enter the validation key you receive below. If you receive an error, it should give you some idea of what went wrong.

        vagrant@m103:~$ validate_lab_first_application_user

Solution: 

        5a32fdd630bff1f2fcb87acf

***See detailed answer***

In order to create this new user, we have to be logged into your MongoDB server as a user with the privilege to create other users. Luckily, the m103-admin user from previous labs has the root role, and therefore has this privilege.

As a reminder, authenticating to MongoDB as this user can be done with the following command:

        mongo --port 27000 -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

Once we are logged in, we can create our new user with the following command:

        use admin
        db.createUser({
            user: "m103-application-user",
            pwd: "m103-application-pass",
            roles: [
                {role: "readWrite", db: "applicationData"}
            ]
        })

Notice that we created our user on the admin database, but we gave that user readWrite access to the applicationData database. These are two separate actions - the user authenticates against admin and is authorized on applicationData.

## 1.11 Server Tools Overview

### Lecture Instructions

List mongodb binaries:

        find /usr/bin/ -name "mongo*"

Create new dbpath and launch mongod:

        mkdir -p ~/first_mongod
        mongod --port 30000 --dbpath ~/first_mongod --logpath ~/first_mongod/mongodb.log --fork

Use mongostat to get stats on a running mongod process:

        mongostat --help
        mongostat --port 30000

Use mongodump to get a BSON dump of a MongoDB collection:

        mongodump --help
        mongodump --port 30000 --db applicationData --collection products
        ls dump/applicationData/
        cat dump/applicationData/products.metadata.json

Use mongorestore to restore a MongoDB collection from a BSON dump:

        mongorestore --drop --port 30000 dump/

Use mongoexport to export a MongoDB collection to JSON or CSV (or stdout!):

        mongoexport --help
        mongoexport --port 30000 --db applicationData --collection products
        mongoexport --port 30000 --db applicationData --collection products -o products.json

Tail the exported JSON file:

        tail products.json

Use mongoimport to create a MongoDB collection from a JSON or CSV file:

        mongoimport --port 30000 products.json

### Quiz

Which of the following are true differences between mongoexport and mongodump?

- [ ] Mongoexport is typically faster than mongodump.
- [x] Mongodump can create a data file and a metadata file, but mongoexport just creates a data file.
- [ ] Mongoexport outputs BSON, but mongodump outputs JSON.
- [x] By default, mongoexport sends output to standard output, but mongodump writes to a file.
- [x] Mongodump outputs BSON, but mongoexport outputs JSON.

***See detailed answer***

__Incorrect answers:__

- __Mongoexport outputs BSON, but mongodump outputs JSON.__

The reverse is true - mongoexport outputs JSON, and mongodump outputs BSON.

- __Mongoexport is typically faster than mongodump.__

Mongoexport must convert every document from BSON to JSON. This takes much longer than mongodump, which simply outputs BSON.

All other answers are correct.

## Lab - Importing a Dataset

### Problem 

Now that you have some background about MongoDB's server tools, use mongoimport to import a JSON dataset into MongoDB. You can find the dataset inside the Vagrant box in /dataset/products.json, or in the lesson handout.

Import the whole dataset with your application's user m103-application-user into a collection called products, in the database applicationData.

When you're finished, run the following validation script in your vagrant and outside the mongo shell and enter the validation key you receive below. If you receive an error, it should give you some idea of what went wrong.

        vagrant@m103:~$ validate_lab_import_dataset

Solution:

        5a383323ba6dbcf3cbcaec97

***See detailed answer***

The import can be properly completed with the following command:

        mongoimport --drop --port 27000 -u "m103-application-user" \
        -p "m103-application-pass" --authenticationDatabase "admin" \
        --db applicationData --collection products /dataset/products.json

We authenticate to the database the same way with mongoimport as we did with mongo. The flags --db and --collection are used to designate a target database and collection for our data. The flag --drop is used to drop the existing collection, so we don't create duplicates by running this command twice.

# Lectures

- [mongod](https://docs.mongodb.com/manual/reference/program/mongod/)
- [Advanced Schema Design presentation](https://www.mongodb.com/presentations/advanced-schema-design-pattern)