# Chapter 3: Index Operations

## 3.1 Building Indexes

### Quiz

Problem:

Which of the following are true of index build operations?

- [x] Foreground index builds block all reads and writes to the collection being indexed.
- [x] Foreground index builds block all reads and writes to the database that holds the collection being indexed.
- [ ] Background index builds do not impact the query performance of the MongoDB deployment while running.
- [x] Background index builds take longer to complete than foreground index builds.
- [ ] Background index builds block reads and writes to the collection being indexed.

## 3.2 Query Plans

### Quiz

Problem:

Which of the following is/are true concerning query plans?

- [ ] MongoDB's query optimizer is statistically based, where collection heuristics are used to determine which plan wins.
- [x] Query plans are cached so that plans do not need to be generated and compared against each other every time a query is executed.
- [ ] When query plans are generated, for a given query, every index generates at least one query plan.
- [ ] If an index can't be used, then there is no query plan for that query.

***See detailed answer***

- MongoDB's query optimizer is statistically based, where collection heuristics are used to determine which plan wins.

No, MongoDB has an empirical query optimizer where query plans are ran against each other during a trial period.

- Query plans are cached so that plans do not need to be generated and compared against each other every time a query is executed.

Yes, that is correct.

- When query plans are generated, for a given query, every index generates at least one query plan.

No, only a subset of the indexes are considered as candidates for planning.

- If an index can't be used, then there is no query plan for that query.

No, if there aren't any viable indexes for a given query, then a COLLSCAN stage will be the main stage of the query plan.

## 3.3 Understanding Explain

### Quiz

Problem:

With the output of an explain command, what can you deduce?

- [x] The index used by the chosen plan.
- [x] If a sort was performed by walking the index or done in memory.
- [ ] All the available indexes for this collection.
- [x] All the different stages the query needs to go through with details about the time it takes, the number of documents processed and returned to the next stage in the pipeline.
- [ ] The estimation of the cardinalities of the distribution of the values.

***See detailed answer***

- The index used by the chosen plan

Yes, additional information will be the direction the index is used, the bounds of the values looked at and the number of keys examined.

- If a sort was performed by walking the index or done in memory

Yes.

- All the available indexes for this collection

No, you will be able to see the ones considered by the other plans that were rejected with the "allExecutionPlans" option, but this is possibly only a subset of all indexes.

- All the different stages the query needs to go through with details about the time it takes, the number of documents processed and returned to the next stage in the pipeline

Yes.

- The estimation of the cardinalities of the distribution of the values

No, while some RDBMS use this kind of statistics to select indexes, MongoDB executes all select plans for a short duration of time and picks the best based on execution results.


## 3.4 Forcing Indexes with Hint

### Quiz

Problem

What is the method that forces MongoDB to use a particular index?

- [ ] force()
- [ ] suggest()
- [x] hint()
- [ ] index()
- [ ] 

## 3.5 Resource Allocation for Indexes

### Quiz

Problem:

Which of the following statements apply to index resource allocation?

- [x] For the fastest processing, we should ensure that our indexes fit entirely in RAM
- [ ] Index information does not need to completely allocated in RAM since MongoDB only uses the right-end-side to the index b-tree, regardless of the queries that use index.
- [x] Indexes are not required to be entirely placed in RAM, however performance will be affected by constant disk access to retrieve index information.

## 3.6 Basic Benchmarking

### Quiz

Problem:

What type of strategy and tools should we be using to performance benchmark a MongoDB installation?

- [x] Publicly available tools, including correct database variations
- [ ] Mongo shell to test read performance
- [ ] Test transfer ratio using mongodump

## Lab 3.1: Explain Output

### Problem:

In this lab you're going to determine which index was used to satisfy a query given its explain output.

The following query was ran:

        > var exp = db.restaurants.explain("executionStats") 
        > exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint(REDACTED)

Which resulted in the following output:

    {
        "queryPlanner": {
        "plannerVersion": 1,
        "namespace": "m201.restaurants",
        "indexFilterSet": false,
        "parsedQuery": "REDACTED",
        "winningPlan": {
            "stage": "SORT",
            "sortPattern": {
                "name": 1
            },
            "inputStage": {
                "stage": "SORT_KEY_GENERATOR",
                "inputStage": {
                        "stage": "FETCH",
                        "inputStage": {
                           "stage": "IXSCAN",
                            "keyPattern": "REDACTED",
                            "indexName": "REDACTED",
                            "isMultiKey": false,
                            "isUnique": false,
                            "isSparse": false,
                            "isPartial": false,
                            "indexVersion": 1,
                            "direction": "forward",
                            "indexBounds": "REDACTED"
                        }
                    }
                }
        },
        "rejectedPlans": [ ]
        },
        "executionStats": {
           "executionSuccess": true,
            "nReturned": 3335,
            "executionTimeMillis": 20,
            "totalKeysExamined": 3335,
            "totalDocsExamined": 3335,
            "executionStages": "REDACTED"
        },
        "serverInfo": "REDACTED",
        "ok": 1
    }

Given the redacted explain output above, select the index that was passed to hint.

- [ ] `{ "address.state": 1, "name": 1, "stars": 1 }`
- [ ] `{ "address.state": 1, "stars": 1, "name": 1 }`
- [ ] `{ "address.state": 1, "name": 1 }`
- [x] `{ "address.state": 1 }`

***See detailed answer***

- `{ "address.state": 1, "name": 1, "stars": 1 }`

No, if this index was used, then there would be no SORT stage.

- `{ "address.state": 1, "stars": 1, "name": 1 }`

Yes, this query wouldn't need to examine any extra index keys, so since nReturned and totalKeysExamined are both 3,335 we know this index was used.

- `{ "address.state": 1, "name": 1 }`

No, if this index was used, then there would be no SORT stage.

- `{ "address.state": 1 }`

No, if this index was used, then we would expect that we'd have to examine some unnecessary documents and index keys. Since there are 50 states in the US, and we have 1,000,000 documents we'd expect to examine about 20,000 documents, not the 3,335 we see in the output.

# Lectures

- [Index Build Operations](https://docs.mongodb.com/manual/core/index-creation/?jmp=university)
- [Query Plans](https://docs.mongodb.com/manual/core/query-plans/?jmp=university)
- [Deciphering Explain Output](https://www.mongodb.com/presentations/deciphering-explain-output)