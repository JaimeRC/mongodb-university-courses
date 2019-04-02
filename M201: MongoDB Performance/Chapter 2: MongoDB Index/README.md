# Chapter 2: MongoDB Indexes

## 2.1 Introduction to Indexes

### Quiz

Problem:

Which of the following statements regarding indexes are true?
- [x] Indexes are used to increase the speed of our queries.
- [x] The _id field is automatically indexed on all collections.
- [x] Indexes reduce the number of documents MongoDB needs to examine to satisfy a query.
- [x] Indexes can decrease write, update, and delete performance.

## 2.2 Single Field Indexes

### Quiz

Problem:

Which of the following queries can use an index on the zip field?

- [x] `db.addresses.find( { zip : 55555 } )`
- [ ] `db.addresses.find( { city : "Newark", state : "NJ" } )`
- [ ] `db.addresses.find()`

***See detailed answer:***

The only one that specifies a zip code, db.addresses.find( { zip : 55555 } ), is correct.

The others do not specify a zip code, and so they will not use the index.

## 2.3 Sorting with Indexes

### Quiz

Given the following schema for the products collection:

    {
        "_id": ObjectId,
        "product_name": String,
        "product_id": String
    }

And the following index on the products collection:

    { product_id: 1 }

Which of the following queries will use the given index to perform the sorting of the returned documents?

- [ ] `db.products.find({ product_name: 'Wax' }).sort({ product_name: 1 })`
- [x] `db.products.find({ product_name: 'Soap' }).sort({ product_id: 1 })`
- [x] `db.products.find({}).sort({ product_id: 1 })`
- [x] `db.products.find({ product_id: '57d7a1' }).sort({ product_id: -1 })`
- [x] `db.products.find({}).sort({ product_id: -1 })`

***See detailed answer***
- `db.products.find({}).sort({ product_id: 1 })`

Yes.

- `db.products.find({}).sort({ product_id: -1 })`

Yes, in this case the index will be traversed backwards for sorting.

- `db.products.find({ product_id: '57d7a1' }).sort({ product_id: -1 })`

Yes, in this case the index will be used to filter and sort by traversing the index backwards.

- `db.products.find({ product_name: 'Soap' }).sort({ product_id: 1 })`

Yes, in this case the index will be used to first fetch the sorted documents, and then the server will filter on products that match the product name.

- `db.products.find({ product_name: 'Wax' }).sort({ product_name: 1 })`

No, there is no index for sorting or filtering. A collection scan and an in-memory sort will be necessary.

## 2.4 When you can sort with Indexes

### Quiz

Problem:

Which of the following statements are true?

- [x] Index prefixes can be used in query predicates to increase index utilization.
- [x] Index prefixes can be used in sort predicates to prevent in-memory sorts.
- [x] We can invert the keys of an index in our sort predicate to utilize an index by walking it backwards.
- [ ] It's impossible to have a sorted query use an index for both sorting and filtering.

***See detailed answer***

It's impossible to have a sorted query use an index for both sorting and filtering.

No, if our sort keys are a non-prefix subset of the index key pattern and the query includes equality conditions on all the prefix keys that precede the sort keys we can use the index for both sorting and filtering.

All of the following are true:

- Index prefixes can be used in query predicates to increase index utilization.
- Index prefixes can be used in sort predicates to prevent in-memory sorts.
- We can invert the keys of an index in our sort predicate to utilize an index by walking it backwards.


## 2.5 Multikey Indexes

### Quiz

Problem:

Given the following index:

    { name: 1, emails: 1 }

When the following document is inserted, how many index entries will be created?

    {
      "name": "Beatrice McBride",
      "age": 26,
      "emails": [
          "puovvid@wamaw.kp",
          "todujufo@zoehed.mh",
          "fakmir@cebfirvot.pm"
      ]
    }

- [ ] 1
- [ ] 2
- [x] 3
- [ ] 4

***See detailed answer***

Three is the correct answer. There would be the following index entries:

    "Beatrice McBride", "puovvid@wamaw.kp"
    "Beatrice McBride", "todujufo@zoehed.mh"
    "Beatrice McBride", "fakmir@cebfirvot.pm"

## 2.6 Partial Indexes

### Quiz

Problem:

Which of the following is true regarding partial indexes?

- [x] Partial indexes represent a superset of the functionality of sparse indexes.
- [x] Partial indexes can be used to reduce the number of keys in an index.
- [ ] Partial indexes don't support a uniqueness constraint.
- [x] Partial indexes support compound indexes.

***See detailed answer***

All of the following are true:

- Partial indexes represent a superset of the functionality of sparse indexes.
- Partial indexes can be used to reduce the number of keys in an index.
- Partial indexes support compound indexes.
  
The following is not true:

- Partial indexes don't support a uniqueness constraint.

No, you can still specify a uniqueness constraint with a partial index. However, uniqueness will be limited to the keys covered by the partial filter expression.

## 2.7 Text Indexes

### Quiz

Problem:

Which other type of index is mostly closely related to text indexes?

- [ ] Single-key indexes
- [ ] Compound indexes
- [x] Multi-key indexes
- [ ] Partial indexes

***See detailed answer***

The correct answer was: Multi-key indexes.

Yes, both multi-key and text indexes can potentially create many more index keys for each document in the collection.

## 2.8 Collations

### Quiz

Problem:

Which of the following statements are true regarding collations on indexes?

- [ ] MongoDB only allows collations to be defined at collection level
- [x] Collations allow the creation of case insensitive indexes
- [ ] Creating an index with a different collation from the base collection implies overriding the base collection collation.
- [x] We can define specific collations in an index

## Lab 2.1: Using Indexes to Sort

### Problem

In this lab you're going to determine which queries are able to successfully use a given index for both filtering and sorting.

Given the following index:

    {  
        "first_name" : 1,
        "address.state" : -1,
        "address.city" : -1,
        "ssn" : 1  
    }

Which of the following queries are able to use it for both filtering and sorting?

- [x] `db.people.find ({"address.state": "South Dakota", "first_name": "Jessica" }). sort ({ "address.city": -1 })`
- [ ] `db.people.find ({"address.city": "West Cindy" }). sort ({ "address.city": -1 })`
- [ ] `db.people.find ({"first_name": {$ gt: "J"} }). sort ({ "address.city": -1 })`
- [x] `db.people.find ({"first_name": "Jessica", "address.state": {$ lt: "S"} }). sort ({ "address.state": 1})`
- [x] `db.people.find ({"first_name": "Jessica" }). sort ({ "address.state": 1, "address.city": 1})`

***See detailed answer***

The key to this lab is to identify the prefixes for the given index, and to take your time and think about each query one by one.

Here's an explanation for each query:

- `db.people.find ({"first_name": {$ gt: "J"} }). sort ({ "address.city": -1 })`

No, this query doesn't use equality on the index prefix. When using an index for filtering and sorting the query must include equality conditions on all the prefix keys that precede the sort keys. Moreover, on the sort predicate it skipped the next key in the prefix "address.state".

- `db.people.find ({"first_name": "Jessica" }). sort ({ "address.state": 1, "address.city": 1})`

Yes, this query matches with equality on the query predicate with an index prefix, and continues the prefix in the sort predicate by walking the index backward.

- `db.people.find ({"first_name": "Jessica", "address.state": {$ lt: "S"} }). sort ({ "address.state": 1})`

Yes, while this query fails to use equality on the "address.state" field of the index prefix, it uses the same field for sorting.

- `db.people.find ({"address.city": "West Cindy" }). sort ({ "address.city": -1 })`

No, this query does not use an index prefix.

- `db.people.find ({"address.state": "South Dakota", "first_name": "Jessica" }). sort ({ "address.city": -1 })`

Yes, this query is able to use the index prefix. The order of the fields in the query predicate does not matter.

## Lab 2.2: Optimizing Compound Indexes

### Problem

In this lab you're going to examine several example queries and determine which compound index will best service them.

    > b.people.find({
        "address.state": "Nebraska",
        "last_name": /^G/,
        "job": "Police officer"
      })

    > db.people.find({
        "job": /^P/,
        "first_name": /^C/,
        "address.state": "Indiana"
      }).sort({ "last_name": 1 })

    > db.people.find({
        "address.state": "Connecticut",
        "birthday": {
            "$gte": ISODate("2010-01-01T00:00:00.000Z"),
            "$lt": ISODate("2011-01-01T00:00:00.000Z")
        }
      })

If you had to build one index on the people collection, which of the following indexes would best sevice all 3 queries?

- [ ] `{"job": 1, "address.state": 1, "first_name": 1}`
- [ ] `{"trabajo": 1, "dirección.estado": 1}`
- [ ] `{"address.state": 1, "job": 1}`
- [x] `{"address.state": 1, "last_name": 1, "job": 1}`
- [ ] `{"address.state": 1, "job": 1, "first_name": 1}`
- [ ] `{"job": 1, "address.state": 1, "last_name": 1}`

***See detailed answer***

The key to this lab is to determine which index will provide the most index prefixes that can be utilized by the 3 example queries.

Let's analyze each option:

- `{"address.state": 1, "job": 1}`

No, while this index would be able to service all 3 of the example queries, there's a better index that can be used on the first query, and the second query has to do an in-memory sort.

- `{"address.state": 1, "job": 1, "first_name": 1}`

No, this index is better than the first, but it still doesn't help with the sort on the second query.

- `{"address.state": 1, "last_name": 1, "job": 1}`

Yes, this is the best index. This index matches the first query, can be used for sorting on the second, and has an prefix for the 3rd query.

- `{"trabajo": 1, "dirección.estado": 1}`

No, this index can only be used by the first two queries.

- `{"job": 1, "address.state": 1, "first_name": 1}`

No, while this index is better than the one directly above it, this index still cannot be used by the 3rd query at all.

- `{"job": 1, "address.state": 1, "last_name": 1}`

No, this index has the same issues as the index directly above it.


# Lectures

- [Indexes Section](https://docs.mongodb.com/manual/indexes/?jmp=university)
- [MongoDB Storage FAQ](https://docs.mongodb.com/manual/faq/storage/?jmp=university)
- [Single Field Indexes Section](https://docs.mongodb.com/manual/core/index-single/?jmp=university)
- [Use Indexes to Sort Query Results](https://docs.mongodb.com/manual/tutorial/sort-results-with-indexes/?jmp=university)
- [Compound Indexes](https://docs.mongodb.com/manual/core/index-compound/?jmp=university)
- [Create Indexes to Support Your Queries](https://docs.mongodb.com/manual/tutorial/create-indexes-to-support-queries/?jmp=university)
- [Use Indexes to Sort Query Results](https://docs.mongodb.com/manual/tutorial/sort-results-with-indexes/?jmp=university)
- [Multikey Indexes](https://docs.mongodb.com/manual/core/index-multikey/?jmp=university)
- [Partial Indexes](https://docs.mongodb.com/manual/core/index-partial/?jmp=university)
- [Collations](https://docs.mongodb.com/manual/reference/collation/?jmp=university)
