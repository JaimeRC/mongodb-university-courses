# Chapter 1: Introduction and Aggregation Concepts

## 1.1 The Concept of Pipelines

### Quiz

Problem:

Which of the following is true about pipelines and the Aggregation Framework?

- [x] Documents flow through the pipeline, passing from one stage to the next
- [ ] Stages cannot be configured to produce our desired output.
- [x] The Aggregation Framework provides us many stages to filter and transform our data
- [ ] Pipelines must consist of at least two stages.

**See detailed answer***

Let's review this quiz options:

- Stages cannot be configured to produce our desired output.
This is definitely not correct. Stages can be configured in almost any way we desire.

- Pipelines must consist of at least two stages.
This is not correct. Pipelines must consist of at least one stage, and can have many stages.

- Documents flow through the pipeline, passing one stage to the next
This is correct.

- The Aggregation Framework provides us many stages to filter and transform our data.
This is also correct.

## 1.2 Aggregation Structure and Syntax

### Quiz

Problem:

Which of the following statements is true?

- [ ] Only one expression per stage can be used.
- [x] An aggregation pipeline is an array of stages.
- [x] Some expressions can only be used in certain stages.

***See detailed answer***
In this quiz, we have the following correct answers:

- An aggregation pipeline is an array of stages.
  
This is correct.

- Some expressions can only be used in certian stages.
  
This is correct. For example, accumulator expressions can only be used within the $group stage, with select accumulator expressions available in the $project stage. You'll learn about these stages in depth in the course!

The other option is incorrect:

- Only one expression per stage can be used.
  
This is not correct. Multiple expressions can be used.

# Lectures

- [Aggregation Pipeline Quick Reference](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/)