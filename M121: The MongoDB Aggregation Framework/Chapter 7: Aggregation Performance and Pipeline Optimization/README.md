# Chapter 7: Aggregation Performance and Pipeline Optimization

## 7.1 Aggregation Performance

### Quiz

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


## 7.2 Aggregation Pipeline on a Sharded Cluster

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

## 7.3 Pipeline Optimization

### Quiz

Problem:

Which of the following statements is/are true?

- [x] The query in a $match stage can be entirely covered by an index
- [x] The Aggregation Framework will automatically reorder stages in certain conditions
- [x] Causing a merge in a sharded deployment will cause all subsequent pipeline stages to be performed in the same location as the merge
- [x] The Aggregation Framework can automatically project fields if the shape of the final document is only dependent upon those fields in the input document.

***See detailed answer***



# Lectures

- [Aggregation Pipeline and Sharded Collections](https://docs.mongodb.com/manual/core/aggregation-pipeline-sharded-collections/?jmp=university)
- 