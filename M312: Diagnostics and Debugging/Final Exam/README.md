# Final Exam

## Question 1

### Problem:

Which of the following is/are true of performance drops in MongoDB?

- [x] db.currentOp() can be used to find long-running processes.
- [x] Background index builds may result in a drop in performance.
- [ ] If the .explain() plan is showing that a query is using an index, then that query has definitely been fully optimized.

***See detailed answer***

The following are correct:

- db.currentOp() can be used to find long-running processes.
    - A long-running process, by definition, is going to stick around for awhile. db.currentOp() is likely to find it, unless it ends before the command can be run, and it's also possible to find the number of seconds the process has been running.

- Background index builds may result in a drop in performance.
    - Background index builds involve allocation of resources away from standard database operations. They yield to allow reads and writes to come through, but they can still be expensive operations. This is why a rolling index build can be preferable in production.

The following are incorrect:

- If the .explain() plan is showing that a query is using an index, then that query has definitely been fully optimized.

    - This is false. A good example would be the following, which uses an index, but (1) 99% of the documents the server touches to fulfill this query are not returned by the query, and (2) performs an in-memory sort that would have been avoided with a better index:

            use m312;
            db.poorlyUsedIndex.drop();
            for (k=1; k<=100; k++) { for (j=1; j<=100; j++) { docs = []; for (i=1; i<=100; i++) { docs.push( { a : i, b : j, c : k } ) }; db.poorlyUsedIndex.insertMany(docs) } };
            db.poorlyUsedIndex.createIndex( { a : 1 } );
            db.poorlyUsedIndex.explain("executionStats").find( { a : { $gte : 7, $lte : 10 }, b : 15 } ).sort( { c : -1 } );


## Question 2

### Problem:

You have a replica set with the following parameters:

- All members have 1 vote
- Any delayed secondaries, if present, are delayed by 24 hours
- The wtimeout is set to 60 seconds (60,000 ms) for all writes
- Unless specified, all replica set members use the default settings in MongoDB 3.4.
- The replica set has 3 members
    - Including any delayed Secondaries
    - Including at most one Arbiter
- You are using a write concern of { w : "majority" } for all writes

You should also assume the following, in order to keep the problem simple:

- All parts of the system (the network, the servers, etc.) work as intended
- You will never lose enough servers to prevent a Primary from getting elected
- Any server can go down, and if it does, assume that it will stay down until any writes referenced in this problem have occurred on a Primary, and at least 60 seconds have passed.
- If a Primary goes down, a Secondary will be elected Primary in <10 seconds
    - Any choices offered apply only to writes performed after a new Primary is elected, if applicable.
- "Any one server" can mean any single mongod server process: Primary, Secondary, Delayed Secondary, or Arbiter.

Which of the following is/are true?

- [x] For a replica set with two standard data bearing members plus one delayed Secondary, the application can receive acknowledgment for writes if any one server is lost
- [ ] For a replica set with two data bearing members and one Arbiter (no delayed Secondaries), the application can receive acknowledgment for writes if any one server is lost
- [ ] For a replica set with three standard data-bearing, non-delayed members, the application can receive acknowledgment for writes if any one server is lost

***See detailed answer***

For a 3-member replica set, { w : "majority" } implies that two copies of any write must occur in order for that write to be acknowledged. This means the replica set must be able to (1) elect a Primary, and (2) have one secondary that is current.

The following is correct:

- For a replica set with three standard data-bearing, non-delayed members, the application can receive acknowledgment for writes if any one server is lost
    - This is true. { w : "majority" } requires that you be able to write to two servers in order to receive acknowledgment, and for this setup, you can lose any one server, be able to elect a Primary if necessary, using two servers, and have both a Primary and a Secondary that can take writes.

The following choices are incorrect:

- For a replica set with two data bearing members and one Arbiter (no delayed Secondaries), the application can receive acknowledgment for writes if any one server is lost
    - Suppose that you lose a data bearing server. The remaining server, plus the Arbiter, will have two votes, enough to be able to elect a Primary, if necessary, but there will not be a Secondary to replicate any writes, so no writes wil be acknowledged until the server comes back up.

- For a replica set with two standard data bearing members plus one delayed Secondary, the application can receive acknowledgment for writes if any one server is lost
    - Suppose that a non-delayed member of the replica set goes down. The other non-delayed member will be elected Primary (if it isn't already), but any acknowledgment will have to wait for the server that is down to come back up, or for the delay time to pass. Since the delay is 24 hours, and the wtimeout is 60 seconds, an error will be returned.


## Question 3

### Problem:

Which of the following is/are signs that there may be a schema design problem?

- [x] Many (e.g., more than 5) operations are sent to the database in order to load one piece of frequently accessed content in the application.
- [x] Lots of collections with flat structures in the database (i.e., no subdocuments or arrays).
- [ ] Fields in your documents that are not included in any indexes.

***See detailed answer***

The following are true:

- Lots of collections with flat structures in the database (i.e., no subdocuments or arrays).
    - The real problem here is "lots of collections." This implies over-normalization, possibly due to relational thinking, or possibly due to other reasons. The "flat structures" is a further warning sign in this context, implying that there probably is relational thinking, as the lack of arrays or subdocuments may have come from an overly relational mindset when creating the MongoDB schema. Flat structures on their own aren't necessarily a problem, but in situations with an excessive number of collections, they can be a sign that MongoDB's data structures aren't being fully utilized.

- Many (e.g., more than 5) operations are sent to the database in order to load one piece of frequently accessed content in the application.
    - This is a signal that data is spread out into too many separate documents. It may be due to over-normalization, or it may be due to other reasons, but frequently accessed data should be kept together, as much as possible.

The following is false

- Fields in your documents that are not included in any indexes.
    - This is another option that looks bad until you think about it. First, it wasn't called out as a problem in any of the content. Second, fields should only be indexed if queries need that information to figure out which documents they want to return, or updates need to use that field to determine which documents they will write to. For example, an application may want to store an address for every user, but may never need to find all users in a given city. In that case, there is no reason to put city in an index.

## Question 4

### Problem:

Which of the following is/are true of chunks in a sharded cluster?

- [x] It is possible to change the chunk size in a sharded cluster.
- [x] Chunks that contain documents that all share a single value of the shard key cannot be split.
- [x] The sharded cluster balances the number of chunks on each shard, not the amount of data.

***See detailed answer***

All of the answers are correct. Here are their explanations:

- Chunks that contain documents that all share a single value of the shard key cannot be split.
    - This is true. Documents with the exact same shard key value will always be on the same shard. They cannot be split.

- It is possible to change the chunk size in a sharded cluster.
    - This is true. The instructions are here.

- The sharded cluster balances the number of chunks on each shard, not the amount of data.
    - This is also correct. You can see this by creating a number of chunks, then inserting data into just one of them. db.collection.getShardDistribution() will show you the data distribution.


## Question 5

### Problem:

Given that we don't change the chunkSize settings, which of the following is/are true of jumbo chunks?

- [ ] Jumbo chunks can be moved automatically by MongoDB.
- [ ] Jumbo chunks can be split automatically, if the shard key allows it.
- [ ] Jumbo chunks can be moved manually.
- [x] Jumbo chunks can be split manually, if the shard key allows it.

***See detailed answer***

The following is correct:

- Jumbo chunks can be split manually, if the shard key allows it.
    - This is true. If for some reason the chunk grows to Jumbo size without getting split, but there is sufficient cardinality of the shard key, it can be split manually.

The following are false:

- Jumbo chunks can be split automatically, if the shard key allows it.
    - MongoDB will not attempt to split jumbo chunks. But they can be split manually

- Jumbo chunks can be moved automatically by MongoDB.
    - Jumbo chunks will not be moved automatically by MongoDB. They are large enough that the overhead of chunk migration is a potential problem.

- Jumbo chunks can be moved manually.
    - See the entry above. The same applies to manually moving chunks.


## Question 6

### Problem:

To detect applications that are causing problems from our debugging tools, we should:

- [x] Review historical monitoring information
- [x] Look for spikes in connections
- [ ] Use a continuous integration tool
- [x] Review db.currentOp() and check for long running queries

***See detailed answer***

The following is correct:

- Look for spikes in connections.
    - Spikes in connections might indicate a new application behavior. Alone, spikes in connections are not necessarily caused by application code changes, but they are valid signals to start looking for code changes.

- Review db.currentOp() and check for long running queries
    - db.currentOp() allows us to check what's currently going on in a server. If we start seeing an unusual accumulation of long lasting queries, this should be considered a trigger to start reviewing application log changes, to see where such queries got introduced into the code base.

- Review historical monitoring information
    - The most important tools to keep track of application changes are tools that give us perspective and historical context into the behavior of our system. This can only be achieved if we collect historical monitoring data.

The following are false:

- Use a continuous integration tool
    - A continuous integration tool will allow your developers to have a robust deployment and testing environment but hardly gives information to your DBA and system administrators of how a change affects the production environment.
