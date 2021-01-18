# Chapter 5: Core Aggregation - Multidimensional Grouping

## 5.1 Facets: Single Facet Query

### Quiz

Problem: 

Which of the following aggregation pipelines are single facet queries?

- [ ] `[
  {"$match": { "$text": {"$search": "network"}}},
  {"$sortByCount": "$offices.city"},
]`
- [x] `[
  {"$unwind": "$offices"},
  {"$project": { "_id": "$name", "hq": "$offices.city"}},
  {"$sortByCount": "$hq"},
  {"$sort": {"_id":-1}},
  {"$limit": 100}
]`
- [ ] `[
  {"$match": { "$text": {"$search": "network"}}},
  {"$unwind": "$offices"},
  {"$sort": {"_id":-1}}
]`

***See detailed answer***

Single query facets are supported by the new aggregation pipeline stage $sortByCount.

As like any other aggregation pipelines, except for $out, we can use the output of this stage, as input for downstream stages and operators, manipulating the dataset accordingly.

The correct answers are:

        [
            {"$match": { "$text": {"$search": "network"}}},
            {"$sortByCount": "$offices.city"},
        ]

and

        [
            {"$unwind": "$offices"},
            {"$project": { "_id": "$name", "hq": "$offices.city"}},
            {"$sortByCount": "$hq"},
            {"$sort": {"_id":-1}},
            {"$limit": 100}
        ]

The pipeline

        [
            {"$match": { "$text": {"$search": "network"}}},
            {"$unwind": "$offices"},
            {"$sort": {"_id":-1}}
        ]

is not a single query facet since it does not group any particular data dimension. It simply unwinds an array field and sorts that result set.


## 5.2 Facets: Manual Buckets

### Quiz

Problem:

Assuming that field1 is composed of double values, ranging between 0 and Infinity, and field2 is of type string, which of the following stages are correct?

- [ ] `{'$bucket': { 'groupBy': '$field1', 'boundaries': [ "a", 3, 5.5 ]}}`
- [ ] `{'$bucket': { 'groupBy': '$field1', 'boundaries': [ 0.4, Infinity ]}}`
- [x] `{'$bucket': { 'groupBy': '$field2', 'boundaries': [ "a", "asdas", "z" ], 'default': 'Others'}}`

***See detailed answer***

The correct answer for this quiz is:

        {'$bucket': { 'groupBy': '$field2', 'boundaries': [ "a", "asdas", "z" ], 'default': 'Others'}}

The other two options will end up in error.

- `{'$bucket': { 'groupBy': '$field1', 'boundaries': [ "a", 3, 5.5 ]}}` will generate inconsistent boundary type error. Boundaries are required to have the same type.
- `{'$bucket': { 'groupBy': '$field1', 'boundaries': [ 0.4, Infinity ]}}` will generate a not matching branch, bucket, to place non matching documents. The default stage option would prevent such errors.


## 5.3 Facets: Auto Buckets

### Quiz

Problem:

Auto Bucketing will ...

- [x] given a number of buckets, try to distribute documents evenly accross buckets.
- [x] adhere bucket boundaries to a numerical series set by the granularity option.
- [ ] randomly distributed documents accross arbitrarily defined bucket boundaries.
- [ ] count only documents that contain the groupBy field defined in the documents.

***See detailed answer***

The two correct options are:

- Auto Bucketing will, given a number of buckets, try to distribute documents evenly across buckets.
- Auto Bucketing will adhere bucket boundaries to a numerical series set by the granularity option
  
Auto bucketing facets, defined using $bucketAuto stage, will generate buckets accordingly with the number of buckets requested, buckets field, distributing the documents evenly across those buckets, by default.

In case we define a granularity for this stage, it will use the specified numerical series to determined the boundaries of the buckets and generate buckets according with those boundaries.

## 5.4 Facets: Multiple Facets

### Quiz

Problem:

Which of the following statement(s) apply to the $facet stage?

- [x] The $facet stage allows several sub-pipelines to be executed to produce multiple facets.
- [x] The $facet stage allows the application to generate several different facets with one single database request.
- [ ] The output of the individual $facet sub-pipelines can be shared using the expression $$FACET.$.
- [ ] We can only use facets stages ($sortByCount, $bucket and $bucketAuto) as sub-pipelines of $facet stage.

***See detailed answer***

The correct answers are:

- The $facet stage allows several sub-pipelines to be executed to produce multiple facets.
- The $facet stage allows the applications to generate several different facets with one single database request.

The $facet stage allows other stages to be included on the sub-pipelines, except for:

- $facet
- $out
- $geoNear
- $indexStats
- $collStats
  
Also, the sub-pipelines, defined for each individual facet, cannot share their output accross other parallel facets. Each sub-pipeline will receive the same input data set but does not share the result dataset with parallel facets.

## Lab - $facets

### Problem

How many movies are in both the top ten highest rated movies according to the imdb.rating and the metacritic fields? We should get these results with exactly one access to the database.

Hint: What is the intersection?

- [ ] 2
- [ ] 3
- [x] 1
- [ ] 5

***See detailed answer***

The solution we used follows, following the requirement that we use only one database access

        db.movies.aggregate([
        {
            $match: {
            metacritic: { $gte: 0 },
            "imdb.rating": { $gte: 0 }
            }
        },
        {
            $project: {
            _id: 0,
            metacritic: 1,
            imdb: 1,
            title: 1
            }
        },
        {
            $facet: {
            top_metacritic: [
                {
                $sort: {
                    metacritic: -1,
                    title: 1
                }
                },
                {
                $limit: 10
                },
                {
                $project: {
                    title: 1
                }
                }
            ],
            top_imdb: [
                {
                $sort: {
                    "imdb.rating": -1,
                    title: 1
                }
                },
                {
                $limit: 10
                },
                {
                $project: {
                    title: 1
                }
                }
            ]
            }
        },
        {
            $project: {
            movies_in_both: {
                $setIntersection: ["$top_metacritic", "$top_imdb"]
            }
            }
        }
        ])
        We begin with a $match and $project stage to only look at documents with the relevant fields, and project away needless information

        {
        $match: {
            metacritic: { $gte: 0 },
            "imdb.rating": { $gte: 0 }
        }
        },
        {
        $project: {
            _id: 0,
            metacritic: 1,
            imdb: 1,
            title: 1
        }
        },

Next follows our $facet stage. Within each facet, we need sort in descending order for metacritic and imdb.ratting and ascending for title, limit to 10 documents, then only retain the title

        {
        $facet: {
            top_metacritic: [
            {
                $sort: {
                metacritic: -1,
                title: 1
                }
            },
            {
                $limit: 10
            },
            {
                $project: {
                title: 1
                }
            }
            ],
            top_imdb: [
            {
                $sort: {
                "imdb.rating": -1,
                title: 1
                }
            },
            {
                $limit: 10
            },
            {
                $project: { title: 1 }
            }
            ]
        }
        },

Lastly, we use a $project stage to find the intersection of top_metacritic and top_imdb, producing the titles of movies in both categories

        {
            $project: {
                movies_in_both: {
                    $setIntersection: ["$top_metacritic",  "$top_imdb"]
                }
            }
        }

This results in the following output

        { "movies_in_both" : [ { "title" : "The Godfather" } ] }

# Lectures

- [$sortByCount stage](https://university.mongodb.com/mercury/M121/2019_March/chapter/Chapter_4_Core_Aggregation_-_Multidimensional_Grouping/lesson/58531cd04108be63452110d8c/tab/753352cbdbcba7fe1fd96a04)
- [$bucket](https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/)
- [$bucket stage](https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/?jmp=university)
- [$bucketAuto](https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/)
- [$bucketAuto stage](https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/)
- [$facet stage](https://docs.mongodb.com/manual/reference/operator/aggregation/facet/?jmp=university)
- [$sortByCount](https://docs.mongodb.com/manual/reference/operator/aggregation/sortByCount/)