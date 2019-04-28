# Chapter 5: Schema Issues

## Lab: Investigate Schema Issues

### Problem

In this homework assingment we are expecting you to have the m312RS Replica Set cluster up and running in your VM. To get it started you can run the following command:

        mlaunch init --replicaset --wiredTigerCacheSizeGB 0.3 --host localhost \
        --port 30000 --oplogSize 100 --name m312RS --dir /data/m312
        
Download the handout, and add it to the VM. Initialize the database by running the following:

        ./library_db_simulator.py --init

This will drop the m312 database, populate its collections, and create indexes. You can run it with --help to control some of the parameters it uses.

Next, run it in the following mode:

        ./library_db_simulator.py --simulate

After the first batch of queries, each time you hit enter, it will simulate someone checking out a book. Your task is to determine which of the following are issues:

- [x] The application is triggering many more queries than are necessary for each operation.
- [ ] The schema suffers from excessive normalization.
- [ ] The application is creating too many connections to the replica set without closing them.

***See detailed answer***

The correct answer is:

- The application is triggering many more queries than are necessary for each operation.

You can see this in a number of ways. The most apparent way is to turn on the profiler:

        db.setProfilingLevel(2)

and then hitting "enter" on the simulated application.

Then turn off the profiler and count the queries.

        db.setProfilingLevel(0)
        db.system.profile.count()
        
Far too many operations (read AND write) are occurring.

You can also see this if you run mongostat.

The following are not correct:

- The schema suffers from excessive normalization.

You can look at the fact that there are only 4 collections to see this.

You will also notice that the book's "checked out" status is logged in the "users" collection. Each user has a list of checked-out books, with a unique index on the book_id. If you query this, you can determine if a book is checked out or not.

- The application is creating too many connections to the replica set without closing them.

You can see that this is not a problem by looking at mongostat, or by examining the logs, where you can see that the number of connections doesn't spike.



