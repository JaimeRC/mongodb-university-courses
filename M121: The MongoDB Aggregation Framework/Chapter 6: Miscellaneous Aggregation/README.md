# Chapter 6: Miscellaneous Aggregation

## 6.1 The $out Stage

### Quiz

Problem:

Which of the following statements is true regarding the $out stage?

- [ ] $out removes all indexes when it overwrites a collection.
- [x] $out will overwrite an existing collection if specified.
- [ ] If a pipeline with $out errors, you must delete the collection specified to the $out stage.
- [ ] Using $out within many sub-piplines of a $facet stage is a quick way to generate many differently shaped collections.

***See detailed answer***

The correct choice is:

- $out will overwrite an existing collection if specified.

The following choices are incorrect:

Using $out within many sub-piplines of a $facet stage is a quick way to generate many differently shaped collections.

- $out must be the last stage in a pipeline, and is not allowed within a $facet stage.

$out removes all indexes when it overwrites a collection.

This is incorrect. All indexes on an existing collection are rebuilt when $out overwrites the collection, so must be honored.

- If a pipeline with $out errors, you must delete the collection specified to the $out stage.
  
This is incorrect. $out will not create a new collection or overwrite an existing collection if the pipeline errors.



## 6.2 Views

### Quiz 

Problem:

Which of the following statements are true regarding MongoDB Views?

- [x] View performance can be increased by creating the appropriate indexes on the source collection.
- [ ] Views should be used cautiously because the documents they contain can grow incredibly large.
- [ ] A view cannot be created that contains both horizontal and vertical slices.
- [ ] Inserting data into a view is slow because MongoDB must perform the pipeline in reverse.

***See detailed answer***

The following statements are incorrect:

- Views should be used cautiously because the documents they contain can grow incredibly large.

Views contain no documents, they are stored aggregations that run when queried.

- Inserting data into a view is slow because MongoDB must perform the pipeline in reverse.

Views are read-only and contain no information themselves. The documents "in" a view are simply the result of the definining pipeline being executed.

- A view cannot be created that contains both horizontal and vertical slices.

This is definitely not correct. Shaping and filtering stages can can be mixed together in an aggregation pipeline.

# Lectures

- [$redact](https://docs.mongodb.com/manual/reference/operator/aggregation/redact/)