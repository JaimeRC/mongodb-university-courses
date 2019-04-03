# Final Exam

## Question 1

### Problem:

Consider the following aggregation pipelines:

- Pipeline 1

        db.coll.aggregate([
            {"$match": {"field_a": {"$gt": 1983}}},
            {"$project": { "field_a": "$field_a.1", "field_b": 1, "field_c": 1  }},
            {"$replaceRoot":{"newRoot": {"_id": "$field_c", "field_b": "$field_b"}}},
            {"$out": "coll2"},
            {"$match": {"_id.field_f": {"$gt": 1}}},
            {"$replaceRoot":{"newRoot": {"_id": "$field_b", "field_c": "$_id"}}}
        ])

- Pipeline 2

        db.coll.aggregate([
            {"$match": {"field_a": {"$gt": 111}}},
            {"$geoNear": {
                "near": { "type": "Point", "coordinates": [ -73.99279 , 40.719296 ] },
                "distanceField": "distance"}},
            {"$project": { "distance": "$distance", "name": 1, "_id": 0  }}
        ])

- Pipeline 3

        db.coll.aggregate([
            {
                "$facet": {
                "averageCount": [
                    {"$unwind": "$array_field"},
                    {"$group": {"_id": "$array_field", "count": {"$sum": 1}}}
                ],
                "categorized": [{"$sortByCount": "$arrayField"}]
                },
            },
            {
                "$facet": {
                "new_shape": [{"$project": {"range": "$categorized._id"}}],
                "stats": [{"$match": {"range": 1}}, {"$indexStats": {}}]
                }
            }
        ])

Which of the following statements are correct?

- [ ] Pipeline 3 fails since you can only have one $facet stage per pipeline
- [x] Pipeline 3 fails because $indexStats must be the first stage in a pipeline and may not be used within a $facet
- [ ] Pipeline 1 is incorrect because you can only have one $replaceRoot stage in your pipeline
- [x] Pipeline 2 is incorrect because $geoNear needs to be the first stage of our pipeline
- [ ] Pipeline 3 executes correctly
- [ ] Pipeline 2 fails because we cannot project distance field
- [x] Pipeline 1 fails since $out is required to be the last stage of the pipeline

***See detailed answer***

The correct statements are the following:

- Pipeline 3 fails because $indexStats must be the first stage in a pipeline and may not be used within a $facet
  
$indexStats must be the first stage in an aggregation pipeline and cannot be used within a $facet stage.

- Pipeline 1 fails since $out is required to be the last stage of the pipeline

$out is required to be the last stage of the pipeline.

- Pipeline 2 is incorrect because $geoNear needs to be the first stage of our pipeline
  
$geoNear is required to be the first stage of a pipeline.

All other statements are incorrect.

## Question 2

### Problem:

Consider the following collection:

        db.collection.find()
        {
            "a": [1, 34, 13]
        }

The following pipelines are executed on top of this collection, using a mixed set of different expression accross the different stages:

- Pipeline 1
  
        db.collection.aggregate([
            {"$match": { "a" : {"$sum": 1}  }},
            {"$project": { "_id" : {"$addToSet": "$a"}  }},
            {"$group": { "_id" : "", "max_a": {"$max": "$_id"}  }}
        ])

- Pipeline 2
- 
        db.collection.aggregate([
            {"$project": { "a_divided" : {"$divide": ["$a", 1]}  }}
        ])

- Pipeline 3

        db.collection.aggregate([
            {"$project": {"a": {"$max": "$a"}}},
            {"$group": {"_id": "$$ROOT._id", "all_as": {"$sum": "$a"}}}
        ])

Given these pipelines, which of the following statements are correct?

- [ ] Pipeline 2 is incorrect since $divide cannot operate over field expressions
- [x] Pipeline 2 fails because the $divide operator only supports numeric types
- [x] Pipeline 1 is incorrect because you cannot use an accumulator expression in a $match stage.
- [x] Pipeline 3 is correct and will execute with no error
- [ ] Pipeline 1 will fail because $max can not operator on _id field

***See detailed answer***

The correct answers are the following:

- Pipeline 1 is incorrect because you cannot use an accumulator expression on $match stage.
  
We cannot use accumulator expressions within $match. Only query expressions are allowed within $match

- Pipeline 3 is correct and will execute with no error
  
This is correct. Although we may argue that $ROOT variable is totally unnecessary, since _id field will be projected by default from the first $project stage of this pipeline, there are no observable errors with the use of this expression variable

- Pipeline 2 fails because $divide operator only supports numeric types
  
This is true, $divide operator will only supports expressions that represent numeric value types.

All the other statements are not true.

## Question 3

### Problem:

Consider the following collection documents:

        db.people.find()
        { "_id" : 0, "name" : "Bernice Pope", "age" : 69, "date" : ISODate("2017-10-04T18:35:44.011Z") }
        { "_id" : 1, "name" : "Eric Malone", "age" : 57, "date" : ISODate("2017-10-04T18:35:44.014Z") }
        { "_id" : 2, "name" : "Blanche Miller", "age" : 35, "date" : ISODate("2017-10-04T18:35:44.015Z") }
        { "_id" : 3, "name" : "Sue Perez", "age" : 64, "date" : ISODate("2017-10-04T18:35:44.016Z") }
        { "_id" : 4, "name" : "Ryan White", "age" : 39, "date" : ISODate("2017-10-04T18:35:44.019Z") }
        { "_id" : 5, "name" : "Grace Payne", "age" : 56, "date" : ISODate("2017-10-04T18:35:44.020Z") }
        { "_id" : 6, "name" : "Jessie Yates", "age" : 53, "date" : ISODate("2017-10-04T18:35:44.020Z") }
        { "_id" : 7, "name" : "Herbert Mason", "age" : 37, "date" : ISODate("2017-10-04T18:35:44.020Z") }
        { "_id" : 8, "name" : "Jesse Jordan", "age" : 47, "date" : ISODate("2017-10-04T18:35:44.020Z") }
        { "_id" : 9, "name" : "Hulda Fuller", "age" : 25, "date" : ISODate("2017-10-04T18:35:44.020Z") }

And the aggregation pipeline execution result:

        db.people.aggregate(pipeline)
        { "_id" : 8, "names" : [ "Sue Perez" ], "word" : "P" }
        { "_id" : 9, "names" : [ "Ryan White" ], "word" : "W" }
        { "_id" : 10, "names" : [ "Eric Malone", "Grace Payne" ], "word" : "MP" }
        { "_id" : 11, "names" : [ "Bernice Pope", "Jessie Yates", "Jesse Jordan", "Hulda Fuller" ], "word" : "PYJF" }
        { "_id" : 12, "names" : [ "Herbert Mason" ], "word" : "M" }
        { "_id" : 13, "names" : [ "Blanche Miller" ], "word" : "M" }

Which of the following pipelines generates the output result?

- [x] `var pipeline = [{
    "$project": {
      "surname_capital": { "$substr": [{"$arrayElemAt": [ {"$split": [ "$name", " " ] }, 1]}, 0, 1 ] },
      "name_size": {  "$add" : [{"$strLenCP": "$name"}, -1]},
      "name": 1
    }
  },
  {
    "$group": {
      "_id": "$name_size",
      "word": { "$push": "$surname_capital" },
      "names": {"$push": "$name"}
    }
  },
  {
    "$project": {
      "word": {
        "$reduce": {
          "input": "$word",
          "initialValue": "",
          "in": { "$concat": ["$$value", "$$this"] }
        }
      },
      "names": 1
    }
  },
  {
    "$sort": { "_id": 1}
  }
]`

- [ ] `var pipeline = [{
    "$sort": { "date": 1 }
  },
  {
    "$group": {
      "_id": { "$size": { "$split": ["$name", " "]} },
      "names": {"$push": "$name"}
    }
  },
  {
    "$project": {
      "word": {
        "$zip": {
          "inputs": ["$names"],
          "useLongestLength": false,
        }
      },
      "names": 1
    }
  }]`
- [ ] `var pipeline = [{
    "$project": {
      "surname": { "$arrayElemAt": [ {"$split": [ "$name", " " ] }, 1]},
      "name_size": {  "$add" : [{"$strLenCP": "$name"}, -1]},
      "name":1
    }
  },
  {
    "$group": {
      "_id": "$name_size",
      "word": { "$addToSet": {"$substr": [{"$toUpper":"$name"}, 3, 2]} },
      "names": {"$push": "$surname"}
    }
  },
  {
    "$sort": {"_id": -1}
  }
]`

***See detailed answer***

The correct pipeline is the following:

        var pipeline = [{
            "$project": {
            "surname_capital": { "$substr": [{"$arrayElemAt": [ {"$split": [ "$name", " " ] }, 1]}, 0, 1 ] },
            "name_size": {  "$add" : [{"$strLenCP": "$name"}, -1]},
            "name": 1
            }
        },
        {
            "$group": {
            "_id": "$name_size",
            "word": { "$push": "$surname_capital" },
            "names": {"$push": "$name"}
            }
        },
        {
            "$project": {
            "word": {
                "$reduce": {
                "input": "$word",
                "initialValue": "",
                "in": { "$concat": ["$$value", "$$this"] }
                }
            },
            "names": 1
            }
        },
        {
            "$sort": { "_id": 1}
        }
        ]

For this lab we picked the first letter of each person surname, surname_capital, by splitting the name into an array

        {"$split": [ "$name", " " ] }

And by gathering the first letter of the surname using $substr and $arrayElemAt:

        { "$substr": [{"$arrayElemAt": [ {"$split": [ "$name", " " ] }, 1]}, 0, 1 ] }

We've also captured the number of all alphanumeric characters of the name field, except " ":

        "name_size": {  "$add" : [{"$strLenCP": "$name"}, -1]}

After grouping all first capital letters into word array, and all name into names values by the name_size:

        {
            "$group": {
                "_id": "$name_size",
                "word": { "$push": "$surname_capital" },
                "names": {"$push": "$name"}
            }
        },

We then $reduced the resulting word array into a single string:

        {
            "$project": {
                "word": {
                    "$reduce": {
                        "input": "$word",
                        "initialValue": "",
                        "in": { "$concat": ["$$value", "$$this"] }
                    }
                },
                "names": 1
            }
        }

And finally sort the result:

        {
            "$sort": { "_id": 1}
        }

## Question 4

### Problem:

$facet is an aggregation stage that allows for sub-pipelines to be executed.

        var pipeline = [
        {
            $match: { a: { $type: "int" } }
        },
        {
            $project: {
            _id: 0,
            a_times_b: { $multiply: ["$a", "$b"] }
            }
        },
        {
            $facet: {
            facet_1: [{ $sortByCount: "a_times_b" }],
            facet_2: [{ $project: { abs_facet1: { $abs: "$facet_1._id" } } }],
            facet_3: [
                {
                $facet: {
                    facet_3_1: [{ $bucketAuto: { groupBy: "$_id", buckets: 2 } }]
                }
                }
            ]
            }
        }
        ]

In the above pipeline, which uses $facet, there are some incorrect stages or/and expressions being used.

Which of the following statements point out errors in the pipeline?

- [ ] $sortByCount cannot be used within $facet stage.
- [ ] a $type expression does not take a string as its value; only the BSON numeric values can be specified to identify the types.
- [x] a $type expression does not take a string as its value; only the BSON numeric values can be specified to identify the types.
- [x] facet_2 uses the output of a parallel sub-pipeline, facet_1, to compute an expression
- [ ] a $multiply expression takes a document as input, not an array.

***See detailed answer***

The following options are not true:

- a $multiply expression takes a document as input, not an array.

This is not true, a $multiply expression does take as input an array of expressions.

- a $type expression does not take a string as its value; only the BSON numeric values can be specified to identify the types.

We can use either the numeric BSON representation, as well as a string alias to evaluate a field type.

- $sortByCount cannot be used within $facet stage.

$facet does accept $sortByCount as a sub-pipeline stage.

The correct answers, that reflect problems with the pipeline, are the following:

- can not nest a $facet stage as a sub-pipeline.

This is correct. $facet does not accept all sub-pipelines that include other $facet stages

- facet_2 uses the output of a parallel sub-pipeline, facet_1, to compute an expression

Each sub-pipeline are completely independent of one another. The output of one sub-pipeline cannot be used as the input for different sub-pipelines.

## Question 5

### Problem:

Consider a company producing solar panels and looking for the next markets they want to target in the USA. We have a collection with all the major cities (more than 100,000 inhabitants) from all over the World with recorded number of sunny days for some of the last years.

A sample document looks like the following:

        db.cities.findOne()
        {
            "_id": 10,
            "city": "San Diego",
            "region": "CA",
            "country": "USA",
            "sunnydays": [220, 232, 205, 211, 242, 270]
        }

The collection also has these indexes:

        db.cities.getIndexes()
        [
        {
            "v": 2,
            "key": {
                "_id": 1
        },
            "name": "_id_",
            "ns": "test.cities"
        },
        {
            "v": 2,
            "key": {
                "city": 1
        },
            "name": "city_1",
            "ns": "test.cities"
        },
        {
            "v": 2,
            "key": {
                "country": 1
        },
            "name": "country_1",
            "ns": "test.cities"
        }
        ]

We would like to find the cities in the USA where the minimum number of sunny days is 200 and the average number of sunny days is at least 220. Lastly, we'd like to have the results sorted by the city's name. The matching documents may or may not have a different shape than the initial one.

We have the following query:

        var pipeline = [
            {"$addFields": { "min": {"$min": "$sunnydays"}}},
            {"$addFields": { "mean": {"$avg": "$sunnydays" }}},
            {"$sort": {"city": 1}},
            {"$match": { "country": "USA", "min": {"$gte": 200}, "mean": {"$gte": 220}}},
        ]
        db.cities.aggregate(pipeline)

However, this pipeline execution can be optimized!

Which of the following choices is still going to produce the expected results and likely improve the most the execution of this aggregation pipeline?

- [ ] `var pipeline = [
    {"$match": { "country": "USA"}},
    {"$addFields": { "mean": {"$avg": "$sunnydays"}}},
    {"$match": { "mean": {"$gte": 220}, "sunnydays": {"$not": {"$lt": 200 }}}},
    {"$sort": {"city": 1}},
]`
- [ ] `var pipeline = [
    {"$sort": {"city": 1}},
    {"$match": { "country": "USA"}},
    {"$addFields": { "min": {"$min": "$sunnydays"}}},
    {"$match": { "min": {"$gte": 200}, "mean": {"$gte": 220}}},
    {"$addFields": { "mean": {"$avg": "$sunnydays" }}},
]`
- [ ] `var pipeline = [
    {"$sort": {"city": 1}},
    {"$addFields": { "min": {"$min": "$sunnydays"}}},
    {"$match": { "country": "USA", "min": {"$gte": 200}}},
]`
- [ ] `var pipeline = [
    {"$match": { "country": "USA"}},
    {"$sort": {"city": 1}},
    {"$addFields": { "min": {"$min": "$sunnydays"}}},
    {"$match": { "min": {"$gte": 200}, "mean": {"$gte": 220}}},
    {"$addFields": { "mean": {"$avg": "$sunnydays" }}},
]`
- [ ] `var pipeline = [
    {"$sort": {"city": 1}},
    {"$addFields": { "min": {"$min": "$sunnydays"}}},
    {"$addFields": { "mean": {"$avg": "$sunnydays" }}},
    {"$match": { "country": "USA", "min": {"$gte": 200}, "mean": {"$gte": 220}}},
]`

***See detailed answer***

The correct answer is the following:

        var pipeline = [
            {"$match": { "country": "USA"}},
            {"$addFields": { "mean": {"$avg": "$sunnydays"}}},
            {"$match": { "mean": {"$gte": 220}, "sunnydays": {"$not": {"$lt": 200 }}}},
            {"$sort": {"city": 1}}
        ]

In this case, we try to remove as much data as possible upfront, all cities not matching the right country, using the available index.

We then calculate the mean number of sunny days.

The $match stage then filters out documents where the mean isn't greater than or equal to 220, and there are no entries in the sunnydays vector less than 200.

We are left with a sort in memory, however the number should be small enough to not take much resources. There are 285 cities with 100,000 habitants in the USA, and some are likely not to match the number of sunny days criteria.

Another answer provides the desired results, but will not improve the performance as much:

        var pipeline = [
            {"$sort": {"city": 1}},
            {"$addFields": { "min": {"$min": "$sunnydays"}}},
            {"$addFields": { "mean": {"$avg": "$sunnydays" }}},
            {"$match": { "country": "USA", "min": {"$gte": 200}, "mean": {"$gte": 220}}},
        ]

The above approach uses the index to sort, however it performs an unnecessary calculation to get the minimum value within sunnydays. Because the $match stage did not come prior to these $addFields stages, all source documents will pass through them, a wasteful computation.

The pipeline:

        var pipeline = [
            {"$sort": {"city": 1}},
            {"$addFields": { "min": {"$min": "$sunnydays"}}},
            {"$match": { "country": "USA", "min": {"$gte": 200}}},
        ]

does not satisfy the query requirements.

The last 2 queries are doing a $match on mean before it is calculated, making them also invalid.

## Question 6

### Problem:

Consider the following people collection:

        db.people.find().limit(5)
        { "_id" : 0, "name" : "Iva Estrada", "age" : 95, "state" : "WA", "phone" : "(739) 557-2576", "ssn" : "901-34-4492" }
        { "_id" : 1, "name" : "Roger Walton", "age" : 92, "state" : "ID", "phone" : "(948) 527-2370", "ssn" : "498-61-9106" }
        { "_id" : 2, "name" : "Isaiah Norton", "age" : 26, "state" : "FL", "phone" : "(344) 479-5646", "ssn" : "052-49-6049" }
        { "_id" : 3, "name" : "Tillie Salazar", "age" : 88, "state" : "ND", "phone" : "(216) 414-5981", "ssn" : "708-26-3486" }
        { "_id" : 4, "name" : "Cecelia Wells", "age" : 16, "state" : "SD", "phone" : "(669) 809-9128", "ssn" : "977-00-7372" }

And the corresponding people_contacts view:

        db.people_contacts.find().limit(5)
        { "_id" : 6585, "name" : "Aaron Alvarado", "phone" : "(631)*********", "ssn" : "********8014" }
        { "_id" : 8510, "name" : "Aaron Barnes", "phone" : "(944)*********", "ssn" : "********6820" }
        { "_id" : 6441, "name" : "Aaron Barton", "phone" : "(234)*********", "ssn" : "********1937" }
        { "_id" : 8180, "name" : "Aaron Coleman", "phone" : "(431)*********", "ssn" : "********7559" }
        { "_id" : 9738, "name" : "Aaron Fernandez", "phone" : "(578)*********", "ssn" : "********0211" }

Which of the of the following commands generates this people_contacts view?

- [ ] `var pipeline = [
  {
    "$project": {"name":1,
    "phone": {
      "$concat": [
        {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
        "*********"  ]
      },
    "ssn": {
      "$concat": [
        "********",
        {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
      ]
    }
  }
}
];
db.runCommand({
  "create": "people_contacts",
  "viewOn":"people",
  "pipeline": pipeline})`
- [ ] `var pipeline = [
  {
    "$sort": {"name": 1}
  },
  {
    "$project": {"name":1,
    "phone": {
      "$concat": [
        {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
        "*********"  ]
      },
    "ssn": {
      "$concat": [
        "********",
        {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
      ]
    }
  }
}
];
db.createView("people", "people_contacts" pipeline);`
- [ ] `var pipeline = [
  {
    "$sort": {"state": 1}
  },
  {
    "$project": {"name":1,
    "phone": {
      "$concat": [
        {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
        "*********"  ]
      },
    "ssn": {
      "$concat": [
        "********",
        {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
      ]
    }
  }
}
];
db.runCommand({
  "create": "people",
  "viewOn":"people",
  "pipeline": pipeline})`
- [x] `var pipeline = [
  {
    "$sort": {"name": 1}
  },
  {
    "$project": {"name":1,
    "phone": {
      "$concat": [
        {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
        "*********"  ]
      },
    "ssn": {
      "$concat": [
        "********",
        {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
      ]
    }
  }
}
];
db.createView("people_contacts", "people", pipeline);`

***See detailed answer***

The correct answer is:

        var pipeline = [
        {
            "$sort": {"name": 1}
        },
        {
            "$project": {"name":1,
            "phone": {
            "$concat": [
                {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
                "*********"  ]
            },
            "ssn": {
            "$concat": [
                "********",
                {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
            ]
            }
        }
        }
        ];

db.createView("people_contacts", "people", pipeline);
people_contacts view was created using an initial $sort stage. We can see this when comparing the find results between people collection and the view.

After sorting the results the people_contacts presents the documents with two computed (redacted) fields, phone and ssn.

        {
            "$project": {"name":1,
            "phone": {
                "$concat": [
                {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
                "*********"  ]
                },
            "ssn": {
                "$concat": [
                "********",
                {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
                ]
            }
        }

And finally, to create the view using command createView

        db.createView("people_contacts", "people", pipeline);

All other options are incorrect, either because they do not use the correct pipeline or due to the fact that the view creation command is incorrect.

## Question 7

### Problem:

Using the air_alliances and air_routes collections, find which alliance has the most unique carriers(airlines) operating between the airports JFK and LHR, in both directions.

Names are distinct, i.e. Delta != Delta Air Lines

src_airport and dst_airport contain the originating and terminating airport information.

- [ ] SkyTeam, with 4 carriers
- [ ] Star Alliance, with 6 carriers
- [x] OneWorld, with 4 carriers
- [ ] OneWorld, with 8 carriers

***See detailed answer***

The correct answer is OneWorld, with 4 carriers

A pipeline that can be used to get these results is

        db.air_routes.aggregate([
        {
            $match: {
            src_airport: { $in: ["LHR", "JFK"] },
            dst_airport: { $in: ["LHR", "JFK"] }
            }
        },
        {
            $lookup: {
            from: "air_alliances",
            foreignField: "airlines",
            localField: "airline.name",
            as: "alliance"
            }
        },
        {
            $match: { alliance: { $ne: [] } }
        },
        {
            $addFields: {
            alliance: { $arrayElemAt: ["$alliance.name", 0] }
            }
        },
        {
            $group: {
            _id: "$airline.id",
            alliance: { $first: "$alliance" }
            }
        },
        {
            $sortByCount: "$alliance"
        }
        ])

We begin with a $match stage, filtering out routes that do not originate or end at either LHR and JFK

        {
            $match: {
                src_airport: { $in: ["LHR", "JFK"] },
                dst_airport: { $in: ["LHR", "JFK"] }
            }
        },

We then $lookup into the air_alliances collection, matching member airline names in the airlines field to the local airline.name field in the route

        {
            $lookup: {
                from: "air_alliances",
                foreignField: "airlines",
                localField: "airline.name",
                as: "alliance"
            }
        },

We follow with a $match stage to remove routes that are not members of an alliance. We use $addFields to cast just the name of the alliance and extract a single element in one go

        {
            $addFields: {
                alliance: { $arrayElemAt: ["$alliance.name", 0] }
            }
        },

Lastly, we $group on the airline.id, since we don't want to count the same airline twice. We take the $first alliance name to avoid duplicates. Then, we use $sortByCount to get our answer from the results

        {
            $group: {
                _id: "$airline.id",
                alliance: { $first: "$alliance" }
        }
        },
        {
            $sortByCount: "$alliance"
        }

This produces the following output

        { "_id": "OneWorld", "count": 4 }
        { "_id": "SkyTeam", "count": 2 }