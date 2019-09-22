# Chapter 1: Introduction to Data Modeling

## 1.1 Data Modeling in MongoDB

### Quiz

Which of the following statements are true about data modeling using MongoDB?

- [x] MongoDB will help you iterate on the schema designs of your models throughout your application's lifecycle.
- [ ] MongoDB is schema-less so you should not worry about designing a schema for your models.
- [ ] MongoDB should only be used for unstructured datasets.

***See detailed answer***

Correct Option:

- MongoDB will help you iterate on the schema designs of your models throughout your application's lifecycle.

That is absolutely true. The document model is great for data definition, and MongoDB's flexible schema makes it easier for you to apply changes and iterate over your application.

Incorrect Options:

- MongoDB is schema-less so you should not worry about designing a schema for your models.

This is a common misconception about the MonogDB document model. All data sources have a base schema. MongoDB just makes it easier to adapt our models to variations on that schema.

- MongoDB should only be used for unstructured datasets.

This is also a comon misconception. Both unstructured and structured data sets can be easily handled by MongoDB.

## 1.2 The Document Model in MongoDB

### Quiz

Which of the following statements are true about MongoDB documents?

- [x] MongoDB documents have a flexible schema.
- [ ] MongoDB documents within a collection must have the same fields.
- [x] MongoDB documents are stored as BSON documents.

***See detailed answer***

Correct Options:

- MongoDB documents have a flexible schema.
- MongoDB documents are stored as BSON documents.

Incorrect Options:

- MongoDB documents within a collection must have the same fields.

This is incorrect because the flexible schema capability, by definition, allows to have different fields per document, if needed.

## 1.3 Constraints in Data Modeling

### Quiz

Which of the following is not a usual constraint that would impact your data model for MongoDB?

- [ ] Network
- [ ] Disk Drives
- [ ] RAM
- [x] Operating System
- [ ] Security

***See detailed answer***

- Operating System.

When working with MongoDB, you usually don't model based on the Operating System your deployment will be running on. Even if there are differences in Operating System, MongoDB hides most of these differences from you.

## 1.4 The Data Modeling Methodology

### Quiz

Which of the following phases are included in our data modeling methodology for MongoDB?

- [x] Identifying the relationships between pieces of information.
- [x] Applying schema design patterns.
- [x] Identifying the workload of the system.

***See detailed answer***

All three options are the recommended phases of our data modeling methodology.

## 1.5 Model for Simplicity or Performance

### Quiz

Which of the following are use cases in which you should model your data for performance rather than simplicity?

- [x] The application is being developed by 100 engineers.
- [x] There is not an applicable design pattern to the solution.
- [x] It is expected that the solution will be designed with only 10 shards.

***See detailed answer***

Correct Options:

- It is expected that the solution will be designed with only 10 shards.

Don't get caught by the part of the sentence mentioning "only 10 shards". Unless you shard for geographical reasons, it is likely that you use sharding for performance reasons.

- The application is being developed by 100 engineers.

This is a substantial team, so it is likely that your project is not that simple.

Incorrect Option:

- There is not an applicable design pattern to the solution.

In most systems, there is often a possibility to apply patterns. Whether to do it or not depends on the system in question. Not having the opportunity to apply any pattern probably means that the system is very simple.

## 1.6 Identifying the Workload

### Quiz

Which of the following is not part of the first phase of the data modeling methodology?

- [ ] Listing the read operations.
- [ ] Quantifying each of the operations in terms of latency and frequency.
- [x] Identifying the relationships between the units of data.
- [ ] Identifying the durability of each write operation.
- [ ] Listing the write operations.

***See detailed answer***

Correct Options:

Identifying the relationships between the units of data.

This activity is done later in our second phase. It is the only one not related to identifying the workload.

Incorrect Options:

All other options are associated with the identification of the workload.
