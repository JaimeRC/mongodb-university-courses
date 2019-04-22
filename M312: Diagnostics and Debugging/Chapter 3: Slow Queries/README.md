# Chapter 3: Slow Queries

## 3.1 Response Time Degredation

### Quiz

Which of the following can improve an application's response time?

- [x] Having the correct set of indexes.
- [x] Providing enough RAM for our working set
- [x] Optimizing our query results

***See detailed answer***

All of these can improve an application's response time.

- Having the correct set of indexes ensures that your queries are being answered efficiently.
- Having enough RAM for your working set ensures that you're not touching the disk for most queries.
- Optimizing the query results ensures that you're not fetching documents you don't require.

## 3.2 Throughput Drops

### Quiz

Where is the first place to look when you notice a sudden drop in throughput?

- [x] The logs
- [ ] mongotop
- [ ] mongooplog

***See detailed answer***

 The logs are the correct place to look. There, you can find information on slow queries, as well as connections.
 
 Mongotop is useful for telling you where you're spending your time, but isn't the first place to look.
 
 Mongooplog is used to replay an oplog from another machine, locally, and isn't useful for this task in any way.
 
 ## 3.3 Impact of Application Changes
 
 ### Quiz 
 
- [ ] correct future problems, like a crystal ball.
- [x] predict the normal behavior of your application.
- [x] compare your current application performance to benchmarked data.

***See detailed answer***

The following are correct. Keeping historical monitoring data allows you to ...

- predict the normal behavior of your application.

With historical data, you should be able to predict what your application's behavior will look like, to the database, for normal behavior.

- compare your current application performance with benchmarked data.

With historical data, you can compare current performance with historical benchmarks, a useful way of determining if your behavior is normal or not.

This is incorrect:

- Keeping historical monitoring data allows you to correct future problems, like a crystal ball.

As it has been said, "It's difficult to make predictions, especially about the future."

## 3.4 Using Mtools to Find Slow Queries

### Quiz

Which of the following is/are true?

- [x] Mtools has a command line tool to list the slow queries from a mongod log.
- [ ] Mtools has a command line tool to list the slow queries from the profiler.
- [x] Mtools lets you see and slow queries in a two dimensional plot.
- [ ] Both mloginfo and mplotqueries have the ability to filter the slow queries per-collection, as well as other criteria.
- [x] Mtools is not officially supported by MongoDB.

***See detailed answer***

__Incorrect answers:__

- mtools has a command line tool to list the slow queries from the profiler.

The set of tools in mtools is using the mongod log, it can't interpret results from the collections saved by "mongod" profiler.

- Both mloginfo and mplotqueries have the ability to filter the slow queries per-collection, as well as other criteria.

mplotqueries let you do it from its UI, however for mloginfo, you will have to rely on mlogfilter to do it before processing the file.

__Correct answers:__

- Mtools has a command line tool to list the slow queries from a mongod log.
- Mloginfo will do this, and it can be done with mplotqueries, as well.
- Mtools lets you see and slow queries in a two dimensional plot. * Yes, mplotqueries and mlogvis will both allow you to do this.
- Mtools is not officially supported by MongoDB. * Mtools is an open source project that is very useful, but it is not officially supported by MongoDB.

## 3.5 Fixing Missing Indexes

### Quiz

Which of the following are true?

- [x] If your system is under load, using a "rolling upgrade" is the recommended way to build an index.
- [ ] If you have a heavy write load, it is recommended to build indexes in the foreground on the Primary.
- [ ] Compass does not help with indexes.
- [x] We can use Ops Manager to rebuild our indexes
- [ ] mtools is another tool that can help you build indexes.

***See detailed answer***

__Here are the incorrect answers:__

- If you have a heavy write load, it is recommended to build indexes in the foreground on the Primary.

First, you should avoid building indexes on a Primary with a lot of traffic, and certainly not in the foreground, which blocks the writes to the collection.

- Compass does not help with indexes.

You can visualize your indexes, and even create new ones, with Compass.

- mtools is another tool that can help you build indexes.

mtools is great, but it does not help for managing indexes.

__Here are the correct answers:__

- If your system is under load, using a "rolling upgrade" is the recommended way to build an index.

The rolling upgrade will prevent undue load on the primary during the index building process. You can do this either manually, or with Cloud/Ops Manager.

- We can use Ops Manager to rebuild our indexes

This is correct, Ops Manager has the functionality to rebuild and create new indexes.

## Lab: Building an Index in the Foreground in Production

### Problem

In this lab, you're going to simulate a foreground index build, in production.

Setup:

- Download the handouts, and unpack. Place the following in your vagrant VM's shared directory:
    - set_up_building_index_in_foreground.sh
    - building_index_in_foreground.py
- Download and unpack the employees.zip dataset and place it in your vagrant's /shared directory.
- Run set_up_building_index_in_foreground.sh from the /shared directory within your VM, which will do each of the following:
    - Kill any mongod server processes running in the VM
    - Delete the ~/data directory
    - Start a replica set listening on ports 30000, 30001, and 30002.
    - Ensure that the server on port 30000 has the highest priority
    - Sleep for 20 seconds to ensure that a Primary has been elected
    - mongoimport the employees.json file into the m312.employees namespace.
- Next, you'll want to simulate your application, and trigger your index build. If you've set everything up as described here, run building_index_in_foreground.py.

While this is going on, feel free to run mongostat against your server to get a feel for what's going on while your "application" is running.

The python script will do the following:

Your job is to go in and find the index build, plus any evidence of long-running read/update operations that occur as a result of the index build. Be careful not to mistake other operations (such as the mongoimport) for the index build.

Note:

You may find it helpful to rotate your log files , expecially if you run the python script more than once.

To demonstrate that you've identified both the index build, and the long-running operations, answer the following question:

When do the long-running operations begin to appear in the log files, based on their timestamps?

- [ ] More than a minute before the index build began.
- [ ] Less than one second before the index build began.
- [ ] Less than one second after the index build began.
- [ ] More than one second after the index build began, and also more than one second before the index build ended.
- [ ] Less than one second before the index build ended.
- [x] Less than one second after the index build ended.
- [ ] More than one second after the index build ended.
- [ ] More than a minute after the index build ended.

***See detailed answer***

The answer is less than one second after the index build ended.

You can find your log files with:

        ps -ef | grep mongod
        
Look for the item after the --logPath flag. You should see something like the following:

        2017-03-07T04:59:43.902+0000 I INDEX    [conn3498] build index done.  scanned 2888268 total records. 14 secs
        2017-03-07T04:59:43.914+0000 I COMMAND  [conn3498] command m312.$cmd command: createIndexes { createIndexes: "employees", indexes: [ { name: "last_name_1_first_name_1", key: { last_name: 1, first_name: 1 } } ], writeConcern: {} } numYields:0 reslen:113 locks:{ Global: { a cquireCount: { r: 2, w: 2 } }, Database: { acquireCount: { w: 1, W: 1 } }, Collection: { acquireCount: { w: 1 } }, Metadata: { acquireCount: { w: 1 } }, oplog: { acquireCount: { w: 1 } } } protocol:op_query 14368ms
        2017-03-07T04:59:43.915+0000 I COMMAND  [conn3502] command m312.employees command: find { find: "employees", filter: { _id: ObjectId('58be04b01e94b8092bee7a7d') } } planSummary: IDHACK keysExamined:1 docsExamined:1 cursorExhausted:1 numYields:0 nreturned:1 reslen:482 lock s:{ Global: { acquireCount: { r: 2 } }, Database: { acquireCount: { r: 1 }, acquireWaitCount: { r: 1 }, timeAcquiringMicros: { r: 14313556 } }, Collection: { acquireCount: { r: 1 } } } protocol:op_query 14325ms
        2017-03-07T04:59:43.915+0000 I WRITE    [conn3504] update m312.employees query: { _id: ObjectId('58be04b01e94b8092bee7a7d') } planSummary: IDHACK update: { $inc: { count: 1 } } keysExamined:1 docsExamined:1 nMatched:1 nModified:1 numYields:0 locks:{ Global: { acquireCount : { r: 2, w: 2 } }, Database: { acquireCount: { w: 2 }, acquireWaitCount: { w: 1 }, timeAcquiringMicros: { w: 14263073 } }, Collection: { acquireCount: { w: 1 } }, Metadata: { acquireCount: { w: 1 } }, oplog: { acquireCount: { w: 1 } } } 14275ms
        2017-03-07T04:59:43.915+0000 I COMMAND  [conn3506] command m312.employees command: find { find: "employees", filter: { _id: ObjectId('58be04b01e94b8092bee7a7d') } } planSummary: IDHACK keysExamined:1 docsExamined:1 cursorExhausted:1 numYields:0 nreturned:1 reslen:482 lock s:{ Global: { acquireCount: { r: 2 } }, Database: { acquireCount: { r: 1 }, acquireWaitCount: { r: 1 }, timeAcquiringMicros: { r: 14208478 } }, Collection: { acquireCount: { r: 1 } } } protocol:op_query 14220ms
        2017-03-07T04:59:43.915+0000 I COMMAND  [conn3504] command m312.$cmd command: update { update: "employees", ordered: true, updates: [ { q: { _id: ObjectId('58be04b01e94b8092bee7a7d') }, u: { $inc: { count: 1 } }, multi: false, upsert: false } ] } numYields:0 reslen:119 lo cks:{ Global: { acquireCount: { r: 2, w: 2 } }, Database: { acquireCount: { w: 2 }, acquireWaitCount: { w: 1 }, timeAcquiringMicros: { w: 14263073 } }, Collection: { acquireCount: { w: 1 } }, Metadata: { acquireCount: { w: 1 } }, oplog: { acquireCount: { w: 1 } } } protoc ol:op_query 14275ms

You can see it very clearly if you only look at the INDEX operations and the WRITE operations:

        logPath=$(ps -ef | grep mongo | grep rs1 | awk '{print $14}')
        mlogfilter $logPath --component INDEX

Look for the log files immediately before and after the index build. There should be none at all in the seconds before, and they should start hitting the logs very quickly after the build is done.

The .find() queries will tell the same story. Any other operations you see in your logs will be from other operations, such as a mongoimport.

## Lab: Analyse Profiler Data

### Problem

In this lab, you are tasked to determine when a given event happened by analysing the system.profiler data.

This profiler information was captured during the execution of test script performing read operations. These read operations, consisted on 3 types of queries:

- query on _id field -> db.employees.find({_id: XXXX})
- query on address.zip field -> db.employees.find({"address.zip": XXX })
- range query on birthday field -> db.employees.find({"birthday": {"$gt": X, "$lt": X }})

To analyse the profiler data, we are going to use the best database in the world that, as you all know, is MongoDB.

Let's go ahead and setup the environment.

- First step, launch a single node mongod instance:

        cd m312-vagrant-env
        vagrant up
        vagrant ssh
        mlaunch --single

- The following step is to download the attached profile.json data and make it available in your m312 virtual machine:
       
        cp Downloads/profiler*.json m312-vagrant-env/dataset

The command line example is set for Unix but a simple copy of this file will suffice

- Next, we will load the dataset into our single node mongod instance. Let's load the data into a collection named profiler_data
      
        vagrant ssh
        mongoimport -d m312 -c profiler_data /dataset/profile.json

The profiler data contains all read operations that surpassed the threshold of 40ms, the set slowms value:

        db.setProfilingLevel(1, 40)

During the execution of our script, our DBAs decided to create an index that affected the behavior of one of the offending queries.

From the profiler data, we are asked to determined which index was created and when was this change reflected on the behavior of our query.

So in this lab we want to know:

- [ ] `db.employees.createIndex({'address.zip': 1}) After 2017-03-06T22:56:30.407Z`
             
- [ ] `db.companies.createIndex({'address.zip': 1}) After 2017-03-06T22:57:00.039Z`

- [x] `db.employees.createIndex({'address.zip': 1}) After 2017-03-06T22:55:55.065Z`

- [ ] `db.employees.createIndex({'birthdate': 1}) Before 2017-03-06T22:57:57.332Z`

- [ ] `db.employees.createIndex({'birthdate': 1}) After 2017-03-06T22:57:00.039Z`

***See detailed answer***

This lab asks 2 different questions:

1. Which index was created?
2. When was it created?

To determine after which operation we can see that a change on our query execution, we will have to look for a change on the planSummary of our profile data, for our queries.

        db.profiler_data.find({planSummary: {$ne: "COLLSCAN"}}).sort({ts:1}).limit(1)
        {
          "planSummary": "IXSCAN { address.zip: 1 }",
          "execStats": {
            "stage": "FETCH",
            "nReturned": 41113,
            "executionTimeMillisEstimate": 20,
            "works": 41114,
            "advanced": 41113,
            "needTime": 0,
            "needYield": 0,
            "saveState": 321,
            "restoreState": 321,
            "isEOF": 1,
            "invalidates": 0,
            "docsExamined": 41113,
            "alreadyHasObj": 0,
            "inputStage": {
              "stage": "IXSCAN",
              "nReturned": 41113,
              "executionTimeMillisEstimate": 10,
              "works": 41114,
              "advanced": 41113,
              "needTime": 0,
              "needYield": 0,
              "saveState": 321,
              "restoreState": 321,
              "isEOF": 1,
              "invalidates": 0,
              "keyPattern": {
                "address.zip": 1
              },
              "indexName": "address.zip_1",
              "isMultiKey": false,
              "multiKeyPaths": {
                "address.zip": [ ]
              },
              "isUnique": false,
              "isSparse": false,
              "isPartial": false,
              "indexVersion": 2,
              "direction": "forward",
              "indexBounds": {
                "address.zip": [
                  "[\"18648-1078\", \"18648-1078\"]"
                ]
              },
              "keysExamined": 41113,
              "seeks": 1,
              "dupsTested": 0,
              "dupsDropped": 0,
              "seenInvalidated": 0
            }
          },
          "ts": ISODate("2017-03-06T22:56:30.407Z")
        }

The creation of an index implies that we should no longer use COLLSCAN to support our queries. Which means that, if we look for the first occurrence of a planSummary that is not equals to COLLSCAN, we will find the a point where the query is already running, supported by an index.

To avoid being overloaded by the profiler document we should project the most relevant fields for our task in hands:

- From originatingCommand or execStats, we can tell which command was optimized, in our case a query.
- ts will determine the timestamp on which the COLLSCAN is no longer present
- planSummary will tell us which new query plan summary is there. So we can see which index we are now using. In our case { address.zip: 1 }

This answers the first part of our problem, which index was created:

        db.employees.createIndex({'address.zip': 1})
        
The second part requires a bit more of digging.

If we know that after a certain point, our query become optimized, we need go back and see when was the last ts where the planSummary was still a COLLSCAN

To get this we would need the following query:

        db.profiler_data.find({"ts": {$lt: ISODate("2017-03-06T22:56:30.407Z")}}).sort({ts:-1})

This will give us all the operations, that happened before the detected IXSCAN. Then, we will need to find the latest db.employees.find({"address.zip": XXX }) COLLSCAN query :

        {
        "op": "getmore",
        "ns": "m312.employees",
        "query": {
          "getMore": NumberLong("30684393245"),
          "collection": "employees"
        },
        "originatingCommand": {
          "find": "employees",
          "filter": {
            "address.zip": "03686-4697"
          }
        },
        "cursorid": 30684393245,
        "keysExamined": 0,
        "docsExamined": 617053,
        "cursorExhausted": true,
        "numYield": 4821,
        "locks": {
          "Global": {
            "acquireCount": {
              "r": NumberLong("9644")
            }
          },
          "Database": {
            "acquireCount": {
              "r": NumberLong("4822")
            }
          },
          "Collection": {
            "acquireCount": {
              "r": NumberLong("4822")
            }
          }
        },
        "nreturned": 20491,
        "responseLength": 8222727,
        "protocol": "op_query",
        "millis": 405,
        "planSummary": "COLLSCAN",
        "execStats": {
          "stage": "COLLSCAN",
          "filter": {
            "address.zip": {
              "$eq": "03686-4697"
            }
          },
          "nReturned": 62390,
          "executionTimeMillisEstimate": 276,
          "works": 2888270,
          "advanced": 62390,
          "needTime": 2825879,
          "needYield": 0,
          "saveState": 22567,
          "restoreState": 22567,
          "isEOF": 1,
          "invalidates": 0,
          "direction": "forward",
          "docsExamined": 2888268
        },
        "ts": ISODate("2017-03-06T22:55:55.065Z"),
        "client": "192.168.14.1",
        "allUsers": [ ],
        "user": ""
        }

And therefore the ts value is:

        ISODate("2017-03-06T22:55:55.065Z")

The correct answer would be

        db.employees.createIndex({'address.zip': 1})

        After 2017-03-06T22:55:55.065Z