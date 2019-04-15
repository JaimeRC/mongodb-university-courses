# Chapter 2: Tooling Overview
  
## 2.1 Introduction to Diagnostic and Debugging Tools

### Quiz

If you want tools to help you parse and visualize the log files, which of the following would be the best place to look?

- [ ] mongooplog
- [ ] mongoreplay
- [x] mtools
- [ ] mongotop
- [ ] mongostat

***See detailed answer***

__Correct answer:__

- The one correct answer is mtools, which includes the log parsing tool, mlogfilter, and the visualization tools, mlogvis and mplotqueries, as well as mloginfo, the log parsing tool.

__Incorrect answers:__

- Mongostat is good for determining current activity on a server, but not for dealing with log files.
- Mongotop is good for determining how current activity is distributed across collections/databases, but not with dealing with log files.
- Mongoreplay is good for recreating a query load at a later time and another location, but not for dealing with log files.
- Mongooplog is for locally applying oplog entries polled from a remote server. It does not deal with the server logs, just the oplog (or operations log).

## 2.2 Introducing Server Logs

## Quiz

Which of the following are best learned from the server logs?

- [x] Which of your queries have been long-running
- [x] How many connections your server has
- [ ] Which indexes you have

***See detailed answer***

The correct answers are:

- How many connections your server has

- Which of your queries have been long-running

The incorrect answer is:

- Which indexes you have

Just to be clear, you might be able to find information on indexes you recently built from your server logs, since they store which indexes you build, but this is better learned from the db.collection.getIndexes() command in the administrative shell.

## 2.3 Introducing the Mongo Shell

### Quiz

What is the mongo shell?

- [x] A Javascript interpreter capable of running scripts
- [x] An administrative interface for the MongoDB server process

***See detailed answer***

All of these are correct.

You can connect to the MongoDB server, particularly for administration but also for practicing MongoDB operations, and it's also a Javascript interpreter capable of running (javascript) scripts.

## 2.4 currentOp and killOp

### Quiz 

db.currentOp() is useful for finding which of the following?

- [ ] Connections that have been open for a long time
- [x] Any long-running operations on the server
- [ ] Operations that are individually short-lived, but which are hammering the server and causing performance issues

***See detailed answer***

"Long-running operations" is the only answer to which one could give an unqualified yes.

Connections that have been open for a long time may not be associated with any particular operation, so they won't show up in currentOps unless they are running an operation currently.

Short-lived operations may show up in currentOp, but they will only be present if it is run when the operation is in progress. In general, db.currentOp is bad at finding short-lived processes, even ones that are numerous.

## 2.5 Introducing Server Status

### Quiz

Can I suppress information from the serverStatus command output?

- [ ] No, serverStatus is an administration command therefore it's not possible to suppress information.
- [x] I can, by specifying in the command syntax which output document fields to omit.

***See detailed answer***

The correct answer is:

- I can, by specifying in the command syntax which output document fields to omit.

        db.runCommand({ "serverStatus": 1, "repl": 0, "locks": 1})

Neither of the others are correct. As shown in the video for Part 1, you can explicitly include or omit fields from serverStatus in the command. Adding repl: 0, for example, omits it.

## 2.6 Introducing the Profiler

### Quiz

You have a three-member replica set, capturing time-series data and serving queries. When you turn on the profiler, you find that the application immediately sees high response time on its queries.

Why does profiling interact poorly with this high-volume production workload?

- [x] Turn off profiling, now!

***See detailed answer***

In this quiz, we're being a little silly, but seriously, the profiler is a diagnostic tool, and you should expect it to routinely attenuate performance on a production system.

Don't turn it on unless you're willing to accept that, and turn it off when you're done.

## 2.7 Overview: Server Diagnostic Tools

### Quiz

From the following list, which tool(s) can I use to know, in real time, the number of queries / second occurring in a given replica set?

- [ ] mongoperf
- [x] mongostat
- [ ] mongoreplay
- [ ] mongotop

***See detailed answer***

Only mongostat has this functionality. mongoreplay can capture the queries, but doesn't let me know how many are coming in each second in real-time. mongotop looks at time spent in each namespace, but doesn't count queries. mongoperf only looks at simulating a disk I/O load, not at monitoring performance at all.

## 2.8 Overview: Mtools

### Quiz

Which of the following are tools included in the mtools package?

- [ ] mongostat
- [x] mplotqueries
- [x] mgenerate
- [x] mlogvis

***See detailed answer***

The only incorrect answer is mongostat.

In this course, we also cover mongodb server tools, which mongostat is part of, but it's not part of mtools.

## Lab: Analyze Log Components

### Problem

In this lab, we are going to get you to start identifying issues with a single mongod instance.

First, we start by launching a single mongod using the configuration file single.cfg

        mongod --config /shared/single.cfg
        
Second, you should launch a small script, that is also available with this lab handouts, called singleapp.py

        python /shared/singleapp.py

Both of these steps need to be launched from within our vagrant environment m312-vagrant-env.

To be able to launch both the mongod and the python script, you need to make sure that the vagrant image has access to the handout material. To do that, you need to:

- Launch this vagrant environment (steps covered in previous lab)
- Download this lab handouts
- Copy both files ,**single.cfg** and singleapp.py, into the vagrant environment /shared folder

        cp single.cfg m312-vagrant-env/shared
        cp singleapp.py m312-vagrant-env/shared

- And run the previously described commands
Given this single.cfg configuration and the singleapp.py application, a few issues will be logged in the mongod log file.

Which MongoDB component is reporting these issues (enter the name in uppercase) ?

Ignore any filesystem or access control warnings!

Solution:

        NETWORK

***See detailed answer***

The expected answer is:

        NETWORK

Our singleapp.py tries to establish more connections than the single.cfg file allows:

        ...
        net:
          port: 27000
          maxIncomingConnections: 10
        ...

To fix this issue we would either increase the number of incoming connections allowed, or just reduce the number of processes launched by our script.

## 2.9 Performance Statistics

### Quiz

Which of the following are performance metrics available in MongoDB Compass?

- [x] Memory Usage
- [ ] Disk Space Usage
- [x] Number of Operations (Insert, Queries, Updates, etc)
- [x] Network Activity
- [x] Number of Reads & Writes

***See detailed answer***

All of the following are performance metrics available in MongoDB Compass:

- Number of Operations (Insert, Queries, Updates, etc)
- Number of Reads & Writes
- Network Activity
- Memory Usage

Note: While Compass does report the number of "Reads & Writes," it is important to point out that this refers to operational reads & writes. Compass does not display disk reads and writes. An operational read translates into zero or more disk reads, while an operational write translates (usually) into at least 2 disk writes (can be more).

---

Disk Space Usage is currently not a supported performance metric of MongoDB Compass.

## 2.10 $indexStats

### Quiz

You have a sharded cluster with 4 shards. The products collection is sharded on { name : 1, dateCreated : 1 }. There are 4 chunks, one on each server, and here is the range of the shard key:

        s1: { name: MinKey, dateCreated: MinKey}  - { name: "e", dateCreated: MinKey}
        s2: { name: "e", dateCreated: MinKey}  - { name: "g", dateCreated: MinKey}
        s3: { name: "g", dateCreated: MinKey}  - { name: "m", dateCreated: MinKey}
        s4:{ name: "m", dateCreated: MinKey}  - { name: MaxKey, dateCreated: MaxKey}

You have the following indexes:

        { _id: 1 }
        { name: 1, dateCreated: 1 }
        { price : 1 }
        { category: 1 }

You perform the following query:

        db.products.find( { name : { $in : [ "iphone", "ipad", "apple watch" ] } } )

Which of the shards will increment their value of $indexStats for an index as a result of this query?

- [x] s1
- [ ] s2
- [x] s3
- [ ] s4

***See detailed answer***

The first thing to note is that the query uses the shard key, and that it uses just the index prefix. Next, we note that:

- "iPhone" is in shard s3
- "iPad" is in shard s3
- "Apple Watch" is in shard s1

Therefore, it'll be a targeted query, and will hit shards s1 and s3.

While it wasn't part of the question, it increments the {name : 1, dateCreated : 1} index on those shards.


# Lectures

- [Log Messages](https://docs.mongodb.com/manual/reference/log-messages/)
- [mtools](https://github.com/rueckstiess/mtools)