# Chapter 4: CRUD Optimization

## 4.1 Optimizing your CRUD Operations

### Quiz

Problem:

When building indexes to service your queries, which of the following is the general rule of thumb you should keep when ordering your index keys?

Note, use the following definitions to for this question:

- equality: indexed fields on which our queries will do equality matching
- range: indexed fields on which our queries will have a range condition
- sort: indexed fields on which our queries will sort on

Questions:

- [ ] equality, range, sort
- [ ] sort, range, equality
- [ ] sort, equality, range
- [x] equality, sort, range
- [ ] range, sort, equality
- [ ] range, equality, sort

## 4.2 Covered Queries

### Quiz

Problem:

Given the following indexes:

    { _id: 1 }
    { name: 1, dob: 1 }
    { hair: 1, name: 1 }

Which of the following queries could be covered by one of the given indexes?

- [ ] `db.example.find( { _id : 1117008 }, { _id : 0, name : 1, dob : 1 } )`
- [ ] `db.example.find( { name : { $in : [ "Alfred", "Bruce" ] } }, { name : 1, hair : 1 } )`
- [ ] `db.example.find( { name : { $in : [ "Bart", "Homer" ] } }, {_id : 0, hair : 1, name : 1} )`
- [x] `db.example.find( { name : { $in : [ "Bart", "Homer" ] } }, {_id : 0, dob : 1, name : 1} )`

***See detailed answer***

- `db.example.find( { _id : 1117008 }, { _id : 0, name : 1, dob : 1 } )`

No, this query would use the _id index, which doesn't match the projected fields.

- `db.example.find( { name : { $in : [ "Alfred", "Bruce" ] } }, { name : 1, hair : 1 } )`

No, this query would use the { name: 1, dob: 1 } index, but it forgets to omit the _id field.

- `db.example.find( { name : { $in : [ "Bart", "Homer" ] } }, {_id : 0, hair : 1, name : 1} )`

No, this query would use the { name: 1, dob: 1 } index, but it is projecting the hair field.

- `db.example.find( { name : { $in : [ "Bart", "Homer" ] } }, {_id : 0, dob : 1, name : 1} )`

Yes, this query would use the { name: 1, dob: 1 } index, which matches the fields in the projection.

## 4.3 Regex Performance

### Quiz

Problem:

Given the following index:

    db.products.createIndex({ productName: 1 })

And the following query:

    db.products.find({ productName: /^Craftsman/ })

Which of the following are true?

- [ ] The query will need to do a collection scan.
- [x] The query will do an index scan.
- [ ] The query will likely need to look at all index keys.
- [ ] The query would match a productName of "Screwdriver - Craftsman Brand"

***See detailed answer***
- The query will need to do a collection scan.

No, there is an index on productName.

- The query will do an index scan.

Yes, there is an index on productName.

- The query will likely need to look at all index keys.

No, the use of the caret at the beginning reduces the number of keys examined.

- The query would match a productName of "Screwdriver - Craftsman Brand"

No, the query only matches strings that begin with "Craftsman".

## 4.4 Insert Performance

### Quiz

Problem:

Which of the following decreases the write performance of your MongoDB cluster?

- [x] Adding indexes
- [x] Increasing the number of members we acknowledge writes from
- [ ] Upgrading to MongoDB 3.4

## 4.5 Data Type Implications

### Quiz

Problem:

Why is it important to maintain the same data type for fields across different documents?

- [ ] It's just a best practice; all drivers will deal with data type issues by default
- [x] To avoid application data consistency problems
- [x] It helps to simplify the client application logic
- [ ] Because it aligns well with cosmetic shapes of documents

## 4.6 Aggregation Performance

### Quiz

Problem:

With regards to aggregation performance, which of the following are true?

- [ ] You can increase index usage by moving $match stages to the end of your pipeline
- [ ] Passing allowDiskUsage to your aggregation queries will seriously increase their performance
- [x] When $limit and $sort are close together a very performant top-k sort can be performed
- [x] Transforming data in a pipeline stage prevents us from using indexes in the stages that follow

***See detailed answer***

- You can increase index usage by moving $match stages to the end of your pipeline

No, you should move $match stages to the beginning of your pipelines!

- Passing allowDiskUsage to your aggregation queries will seriously increase their performance

No, allowDiskUsage will decrease query performance, but it will be necessary to circumvent the 100MB per stage limit.

- When $limit and $sort are close together a very performant top-k sort can be performed

Yes, this is true!

- Transforming data in a pipeline stage prevents us from using indexes in the stages that follow

Yes, this is true. That's why it's important to put all your index using operators at the front of your pipelines!

## Lab 4.1: Equality, Sort, Range

### Problem

In this lab you're going to use the equality, sort, range rule to determine which index best supports a given query.

Given the following query:

    db.accounts.find( { accountBalance : { $gte : NumberDecimal(100000.00) }, city: "New York" } )
           .sort( { lastName: 1, firstName: 1 } )

Which of the following indexes best supports this query with regards to the equality, sort, range rule.

- [x] `{ city: 1, lastName: 1, firstName: 1, accountBalance: 1 }`
- [ ] `{ lastName: 1, firstName: 1, city: 1, accountBalance: 1 }`
- [ ] `{ lastName: 1, firstName: 1, accountBalance: 1, city: 1 }`
- [ ] `{ accountBalance: 1, city: 1, lastName: 1, firstName: 1 }`

## Lab 4.2: Aggregation Performance

### Problem:

For this lab, you're going to create an index so that the following aggregation query can be executed successfully.

After importing the restaurants dataset, without any indexes:

    $ mongoimport -d m201 -c restaurants --drop restaurants.json

If you attempt to run the following query you'll receive an error.

    db.restaurants.aggregate([
        { $match: { stars: { $gt: 2 } } },
        { $sort: { stars: 1 } },
        { $group: { _id: "$cuisine", count: { $sum: 1 } } }
    ])
 
    {
        "ok": 0,
        "errmsg": "Sort exceeded memory limit of 104857600 bytes, but did not opt in to external sorting. Aborting operation. Pass allowDiskUse:true to opt in.",
        "code": 16819,
        "codeName": "Location16819"
    }

Identify why this error is occuring, and build an index to resolve the issue.

Keep in mind that there might be several indexes that resolve this error, but we're looking for an index as small as possible that services this command.

In the text box below, submit the index that resolves the issue.

For example, if you ran `db.restaurants.createIndex({ foobar: 1 })` to fix the error, then you'd enter `{ foobar: 1 }` into the text box.

Note: The index should be ascending in nature.

Solution:

    {stars:1}

***See detailed answer***

The reason that the aggregation query failed is because an in-memory sort is necessary to satisfy the aggregation query, and that in-memory sort uses more than 100MB of memory.

To resolve the issue you can create an index on the field that it sorts on, stars, like so:

    db.restaurants.createIndex({ stars: 1 })
    
Other indexes could also be used like db.restaurants.createIndex({ stars: 1, cuisine: 1}) however, if we are looking for most effective index to support our aggregation command, { stars: 1 } is the optimal option.

# Lectures

- [Create Indexes to Support Your Queries](https://docs.mongodb.com/manual/tutorial/create-indexes-to-support-queries/?jmp=university)
- [Use Indexes to Sort Query Results](https://docs.mongodb.com/manual/tutorial/sort-results-with-indexes/?jmp=university)
- [Create Queries that Ensure Selectivity](https://docs.mongodb.com/manual/tutorial/create-queries-that-ensure-selectivity/?jmp=university)
- [Query Optimization](https://docs.mongodb.com/manual/core/query-optimization/?jmp=university)
- [Write Operation Performance](https://docs.mongodb.com/manual/core/write-performance/?jmp=university)