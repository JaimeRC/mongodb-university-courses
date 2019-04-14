# Chapter 1: Introduction

## 1.1 Introduction to the Course

### Quiz

Which of the following will be covered in this course?

- [x] Examining log files
- [x] Diagnostic tools for MongoDB
- [ ] Index types

***See detailed answer***

The following are correct:

- Diagnostic tools for MongoDB
- Examining log files

These are course chapters.

The following is incorrect:

- Index types

We will be talking about missing indexes and where to create indexes to solve issues ecountered on the sample applications. However, we are not going to take much time diving into the types of indexes or the different variations of these data structures. That is a subject that merits it's own course!

## 1.2 M312 Format and Dynamics

### Quiz

When will we describe the full functionality of a diagnostic tool in this course?

- [ ] The first time to use the tool to diagnose a problem
- [ ] When we first introduce the tool
- [x] Piece by piece, as we find situations where the tool may give us more information.

***See detailed answer***

The answer is:

- Piece by piece, as we find situations where the tool may give us more information.

Unlike in other courses, which are driven by topics, this course is driven by problems we see arise. We'll use tools in different ways, and we'll see only that functionality that is relevant to the problem at any point.

## 1.3 What Problems Look Like in an Application

### Quiz

Which of the following symptoms are we going to explore in this course?

- [x] Response time degredation
- [x] Slow queries
- [ ] Low server bandwidth

***See detailed answer***

The correct answers are "slow queries" and "response time degradation."

We will not be looking at low server bandwidth.

## Lab: Installing Vagrant

### Problem

In this lab, you will set up your vagrant environment. If you've already done it, then you should be all set.

Once your vagrant environment is running, ssh in, and run the following command:

        hostname -f

Type the output of this command below, and submit your answer.

Solution:

        m312.mongodb.university
        
***See detailed answer***

To solve this answer, you'll need to unpack the handout and vagrant up.

        unzip m312-vagrant-env.zip
        vagrant up
        vagrant ssh
        
Then, in the environment,

        hostname -f
        
## 1.4 Getting Started with Compass

### Quiz

Which of the following statements is/are true?

- [x] Compass was developed to give you a powerful interface to understanding, exploring, and editing your MongoDB data, and provide you with insights into your current server and query performance.
- [x] Compass was originally developed as being a full graphical shell replacement for the MongoDB shell.
- [ ] Compass only works with MongoDB 3.4+.
- [ ] Compass was built to be a drop-in replacement for Cloud Manager and Ops Manager.

***See detailed answer***

The following statements are true:

- Compass was originally developed as being a full graphical shell replacement for MongoDB.
- Compass was developed to give you a powerful interface to understanding, exploring, and editing your MongoDB data, and provide you with insights into your current server and query performance.

---

The following statements are false:

- Compass was built to be a drop-in replacement for Cloud Manager and Ops Manager.

No, Compass is an interface to your MongoDB deployment. It lets you view and edit data like you would in the mongo shell, but in a GUI. Ops Manager and Cloud Manager allow you to do operations management.

- Compass only works with MongoDB 3.4+.

No, Compass works with MongoDB Server version 2.6 and higher.

