# Final Exam

## Question 1

### Problem:

Which of these statements is/are true?

- [ ] A collection scan has a logarithmic search time.
- [x] Creating an ascending index on a monotonically increasing value creates index keys on the right-hand side of the index tree.
- [ ] You can index multiple array fields in a single document with a single compound index.
- [ ] Write concern has no impact on write latency.
- [ ] Covered queries can sometimes still require some of your documents to be examined.

***See detailed answer***

The only true statement was:

- Creating an ascending index on a monotonically increasing value creates index keys on the right-hand side of the index tree.
---
Let's take a look at why each of the other statements are false:

- You can index multiple array fields in a single document with a single compound index.

Multikey indexes allow us to index on array fields, but they do not support indexes on multiple array fields on single documents.

- Covered queries can sometimes still require some of your documents to be examined.

A query is covered if and only if it can be satisfied using the keys of the index.

- Write concern has no impact on write latency.

Different write concerns can certainly impact your write latency. Write concerns that only need acknowledgment from a primary are generally faster than ones that need acknowledgment from a majority of replica set members.

- A collection scan has a logarithmic search time.

No, collection scans have a linear search time.

## Question 2

### Problem:

Which of the following statements is/are true?

- [x] It's important to ensure that your shard key has high cardinality.
- [x] Indexes can be walked backwards by inverting their keys in a sort predicate.
- [x] Indexes can decrease insert throughput.
- [x] It's important to ensure that secondaries with indexes that differ from the primary not be eligible to become primary.
- [x] Partial indexes can be used to reduce the size requirements of the indexes.

***See detailed answer**

All of the following statements are true!

- Indexes can decrease insert throughput.
- Partial indexes can be used to reduce the size requirements of the indexes.
- It's important to ensure that secondaries with indexes that differ from the primary not be eligible to become primary.
- Indexes can be walked backwards by inverting their keys in a sort predicate.
- It's important to ensure that your shard key has high cardinality.

## Question 3

### Problem:

Which of the following statements is/are true?

- [x] Collations can be used to create case insensitive indexes.
- [x] It's common practice to co-locate your mongos on the same machine as your application to reduce latency.
- [ ] MongoDB indexes are markov trees.
- [ ] Background index builds block all reads and writes to the database that holds the collection being indexed.
- [x] By default, all MongoDB user-created collections have an _id index.

***See detailed answer***

Let's take a closer look at each of these possibilities:

- MongoDB indexes are markov trees.

No, MongoDB indexes are designed using B-trees.

- By default, all MongoDB user-created collections have an _id index.

Yes, this is true!

- Background index builds block all reads and writes to the database that holds the collection being indexed.

No, foreground index builds block all reads and writes to the database that holds the collection being indexed. Background index builds don't have this limitation, but are generally slower than foreground index builds.

- It's common practice to co-locate your mongos on the same machine as your application to reduce latency.

Yes, this is true!

- Collations can be used to create case insensitive indexes.

Yes, this is true!

## Question 4

### Problem:

Which of the following statements is/are true?

- [ ] On a sharded cluster, aggregation queries using $lookup will require a merge stage on a random shard.
- [ ] When you index on a field that is an array it creates a partial index.
- [x] Indexes can solve the problem of slow queries.
- [ ] Under heavy write load you should scale your read throughput by reading from secondaries.
- [x] Indexes are fast to search because they're ordered such that you can find target values with few comparisons.

***See detailed answer***

- Indexes can solve the problem of slow queries.

This is correct.

- Indexes are fast to search because they're ordered such that you can find target values with few comparisons.

This is correct.

- Under heavy write load you should scale your read throughput by reading from secondaries.

No, since writes are replicated to secondaries all members of the replica set have about the same write workload, therefore sending reads to a secondary will not scale you read throughput.

- When you index on a field that is an array it creates a partial index.

No, when you index a field that is an array it creates a multikey index.

- On a sharded cluster, aggregation queries using $lookup will require a merge stage on a random shard.

No, $lookup, $graphLookup, $facet, and $out all require a merge stage on the primary shard, not a random shard like most other merged queries.

## Question 5

### Problem:

Which of the following statements is/are true?

- [ ] By default, the explain() command will execute your query.
- [x] Query plans are removed from the plan cache on index creation, destruction, or server restart.
- [ ] Compound indexes can service queries that filter on any subset of the index keys.
- [x] If no indexes can be used then a collection scan will be necessary.
- [x] Compound indexes can service queries that filter on a prefix of the index keys.

***See detailed answer***

Let's take a moment to examine each of the choices:

- Compound indexes can service queries that filter on any subset of the index keys.

No, not all subsets of a index's keys can service a query. The prefix of an index's keys can service a query.

- Compound indexes can service queries that filter on a prefix of the index keys.

Yes, this is true!

- If no indexes can be used then a collection scan will be necessary.

Yes, this is true and should be avoided!

- Query plans are removed from the plan cache on index creation, destruction, or server restart.

Yes, this is true!

- By default, the explain() command will execute your query.

No, by default explain() will not execute your query. This is useful to test queries that need to run on a server under heavy load. Passing "executionStats" or "allPlansExecution" will execute the query and collect execution statistics.

## Question 6

### Problem:

Which of the following statements is/are true?

- [x] The ideal ratio between nReturned and totalKeysExamined is 1.
- [ ] Indexes can only be traversed forward.
- [x] An index doesn't become multikey until a document is inserted that has an array value.
- [x] You can use the `--wiredTigerDirectoryForIndexes` option to place your indexes on a different disk than your data.
- [ ] Running performance tests from the mongo shell is an acceptable way to benchmark your database.

***See detailed answer***

- An index doesn't become multikey until a document is inserted that has an array value.

This is correct!

- Running performance tests from the mongo shell is an acceptable way to benchmark your database.

No, you're performance tests should be as close to your production environment as possible. The mongo shell is designed for administrative tasks and ah-hoc queries, not performance benchmarks. You'd also be running in a single thread, which is unlikely how you'd be operating in production.

- You can use the --wiredTigerDirectoryForIndexes option to place your indexes on a different disk than your data.

This is correct!

- Indexes can only be traversed forward.

No, indexes can be traversed both forward and backward.

- The ideal ratio between nReturned and totalKeysExamined is 1.

This is correct!

## Question 7

### Problem

Given the following indexes:

1. { categories: 1, price: 1 }
2. { in_stock: 1, price: 1, name: 1 }

The following documents:

1. { price: 2.99, name: "Soap", in_stock: true, categories: ['Beauty', 'Personal Care'] }
2. { price: 7.99, name: "Knife", in_stock: false, categories: ['Outdoors'] }
3. 
And the following queries:

1. db.products.find({ in_stock: true, price: { $gt: 1, $lt: 5 } }).sort({ name: 1 })
2. db.products.find({ in_stock: true })
3. db.products.find({ categories: 'Beauty' }).sort({ price: 1 })

Which of the following is/are true?

- [ ] There would be a total of 4 index keys created across all of these documents and indexes.
- [ ] Index #1 would provide a sort to query #3.
- [ ] Index #2 can be used by both query #1 and #2.
- [ ] Index #2 properly uses the equality, sort, range rule for query #1.

***See detailed answer***

Let's examine each of these choices:

- Index #1 would provide a sort to query #3.

Yes, that is correct.

- Index #2 properly uses the equality, sort, range rule for query #1.

No, if we were to build an index for query #1 using the equality, sort, range rule, then the index would be: { in_stock: 1, name: 1, price: 1 }.

- There would be a total of 4 index keys created across all of these documents and indexes.

No, there would be 5 total index keys:

- `{ categories: 'Beauty', price: 2.99 }`
- `{ categories: 'Personal Care', price: 2.99 }`
- `{ categories: 'Outdoors', price: 7.99 }`
- `{ in_stock: true, price: 2.99, name: 'Soap' }`
- `{ in_stock: false, price: 7.99, name: 'Knife'}`

The additional index keys are due to the multikey index on categories.

Index #2 can be used by both query #1 and #2.

Yes, that is correct.