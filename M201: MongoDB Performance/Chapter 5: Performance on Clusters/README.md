# Chapter 5: Performance on Clusters

## 5.1 Performance Considerations in Distributed Systems

### Quiz

Problem:

From a performance standpoint, when working with a distributed database it's important to consider...

- [x] Routed Queries
- [x] Latency
- [ ] Reading from secondaries only

***See detailed answer***

- Latency

Yes, "distributed database" implies that we will have several different machines which inevitably will be affected by latency.

- Routed Queries

Yes, to make efficient usage of our cluster data distribution we should use our shard key in our queries.

- Reading from secondaries only

No, reading from secondaries makes sense sometimes, but should not be our main way to read data. If you want to increase read performance you should consider sharding.

## 5.2 Increasing Write Performance with Sharding

### Quiz

Problem:

Which of the following is/are true?

- [ ] Vertical scaling is generally cheaper than horizontal scaling.
- [x] Picking a good shard key is one of the most important parts of sharding.
- [ ] Ordered bulk operations are faster than unordered.

***See detailed answer***

- Vertical scaling is generally cheaper than horizontal scaling.

No, with horizontal scaling our cost to scale increases linearly, whereas that is not the case with vertical scaling because single servers become increasingly more expensive as you upgrade them.

- Picking a good shard key is one of the most important parts of sharding.

Yes, if you don't choose a good shard key, then you won't see the benefits of horizontal scaling.

- Ordered bulk operations are faster than unordered.

No, ordered bulk operations are executed serially, whereas unordered are executed in parallel.

## 5.3 Reading from Secondaries

### Quiz

Problem:

Should you ever read from secondaries on a sharded cluster?

- [x] Select this answer and read the detailed answer section for more information.

***See detailed answer***

As of MongoDB 3.6, because of changes to both logic in chunk migration and read guarantees, it is now safe to read from secondaries as long as the appropriate read concern is specified.

See more info on [Read Concerns] (ttps://docs.mongodb.com/manual/reference/read-concern/?jmp=university)

## 5.4 Replica Sets with Differing Indexes

### Quiz

Problem:

Which of the following conditions apply when creating indexes on secondaries?

- [x] A secondary should never be allowed to become primary
- [ ] These indexes can only be set on secondary nodes
- [ ] We can create specific indexes on secondaries, even if they are not running in standalone mode

***See detailed answer***

- A secondary should never be allowed to become primary

True! If we were to allow it to become primary our application will experience the different set of indexes, once it becomes primary. That will potentially affect your application's expected performance.

- These indexes can only be set on secondary nodes

False! The indexes can be set on the primary node, however we avoid doing so to prevent any impact on the operational workload, since these only service an analytical workload.

- We can create specific indexes on secondaries, even if they are not running in standalone mode

False! No we first need to safely shutdown the secondary, and then restart it in standalone mode before we can create an index on it.

## 5.5 Aggregation Pipeline on a Sharded Cluster

### Quiz

Problem:

What operators will cause a merge stage on the primary shard for a database?

- [x] $out
- [ ] $group
- [x] $facet
- [x] $lookup

***See detailed answer***

- $out

Yes.

- $group

No, $group can potentially cause a merge stage, but a random shard will be selected for the merging.

- $facet

Yes.

- $lookup

Yes.

# Lecture Notes

- [Distributed Queries](https://docs.mongodb.com/manual/core/distributed-queries/?jmp=university)
- [Distributed Write Operations](https://docs.mongodb.com/manual/core/distributed-queries/)
- [Read Preference](https://docs.mongodb.com/manual/core/read-preference/?jmp=university)
- [Aggregation Pipeline and Sharded Collections](https://docs.mongodb.com/manual/core/aggregation-pipeline-sharded-collections/?jmp=university)