# Chapter 3: Core Aggregation - Combining Information

## Lab - $group and Accumulators

### Problem

In the last lab, we calculated a normalized rating that required us to know what the minimum and maximum values for imdb.votes were. These values were found using the $group stage!

For all films that won at least 1 Oscar, calculate the standard deviation, highest, lowest, and average imdb.rating. Use the sample standard deviation expression.

HINT - All movies in the collection that won an Oscar begin with a string resembling one of the following in their awards field

        Won 13 Oscars
        Won 1 Oscar

Select the correct answer from the choices below. Numbers are truncated to 4 decimal places.

- [ ] `{ "highest_rating" : 9.5, "lowest_rating" : 5.9, "average_rating" : 7.5290, "deviation" : 0.5988 }`
- [ ] `{ "highest_rating" : 9.8, "lowest_rating" : 6.5, "average_rating" : 7.5270, "deviation" : 0.5988 }`
- [ ] `{ "highest_rating" : 9.2, "lowest_rating" : 4.5, "average_rating" : 7.5270, "deviation" : 0.5984 }`
- [x] `{ "highest_rating" : 9.2, "lowest_rating" : 4.5, "average_rating" : 7.5270, "deviation" : 0.5988 }`

***See detailed answer***

        db.movies.aggregate([
            {
                $match: {
                 awards: /Won \d{1,2} Oscars?/
                }
            },
            {
                $group: {
                    _id: null,
                    highest_rating: { $max: "$imdb.rating" },
                    lowest_rating: { $min: "$imdb.rating" },
                    average_rating: { $avg: "$imdb.rating" },
                    deviation: { $stdDevSamp: "$imdb.rating"}
                }
            }
        ])

We start by applying the now familiar $match filtering, searching documents for the appropriate text stating they won an Oscar

        {
            $match: {
               awards: /Won \d{1,2} Oscars?/
            }
        },

Next, we have our $group stage. By convention, we group all documents together by specifying null` to ``_id. We use the group accumulators $min, $max, $avg, and $stdDevSamp to get our results

        {
            $group: {
                _id: null,
                highest_rating: { $max: "$imdb.rating" },
                lowest_rating: { $min: "$imdb.rating" },
                average_rating: { $avg: "$imdb.rating" },
                deviation: { $stdDevSamp: "$imdb.rating" }
            }
        }







## Lab - $unwind

### Problem

Let's use our increasing knowledge of the Aggregation Framework to explore our movies collection in more detail. We'd like to calculate how many movies every cast member has been in and get an average imdb.rating for each cast member.

What is the name, number of movies, and average rating (truncated to one decimal) for the cast member that has been in the most number of movies with English as an available language?

Provide the input in the following order and format

        { "_id": "First Last", "numFilms": 1, "average": 1.1 }

Solution:

        { "_id" : "John Wayne", "numFilms" : 107, "average" : 6.4 }

***See detailed answer***

The solution we used is below.

        db.movies.aggregate([
        {
            $match: {
                languages: "English"
            }
        },
        {
            $project: { _id: 0, cast: 1, "imdb.rating": 1 }
        },
        {
            $unwind: "$cast"
        },
        {
            $group: {
                _id: "$cast",
                numFilms: { $sum: 1 },
                average: { $avg: "$imdb.rating" }
            }
        },
        {
            $project: {
                numFilms: 1,
                average: {
                    $divide: [{ $trunc: { $multiply: ["$average", 10] } }, 10]
                }
            }
        },
        {
            $sort: { numFilms: -1 }
        },
        {
            $limit: 1
        }
        ])

We start with a familiar $match stage, looking for movies that include "English" as a language

        {
            $match: {
                languages: "English"
            }
        },

Next, we use a $project stage, keeping only the data necessary for the aggregation stages that follow

        {
            $project: { _id: 0, cast: 1, "imdb.rating": 1 }
        }

$unwind follows next, extracting every entry in the cast array and creating a document for each one

        {
            $unwind: "$cast"
        }

Our $group stage groups cast members together by their name, totals the number of documents, and gets the average imdb.rating

        {
            $group: {
                _id: "$cast",
                numFilms: { $sum: 1 },
                average: { $avg: "$imdb.rating" }
            }
        }

We then use a $project stage to truncate the imdb.rating to one decimal. This is done by first multiplying by 10, truncating the number, then dividing by 10

        {
            $project: {
                numFilms: 1,
                average: {
                    $divide: [
                        { $trunc: { $multiply: ["$average", 10] } }
                        , 10
                    ]
                }
            }
        }

Lastly, we $sort in descending order so the result with the greatest number of movies comes first, and then $limit our result to 1 document, giving the expected answer

        { "_id" : "John Wayne", "numFilms" : 107, "average" : 6.4 }




## 3.1 The $lookup Stage

### Quiz

Problem:

Which of the following statements is true about the $lookup stage?

- [ ] You can specify a collection in another database to from
- [x] The collection specified in from cannot be sharded
- [x] $lookup matches between localField and foreignField with an equality match
- [x] Specifying an existing field name to as will overwrite the the existing field

***See detailed answer***

The only false statement is:

- You can specify a collection in another database to from

This is not true, you can only specify another collection to from within the same database.

All other statements are true.



## Lab - Using $lookup

### Problem

Which alliance from air_alliances flies the most routes with either a Boeing 747 or an Airbus A380 (abbreviated 747 and 380 in air_routes)?

- [ ] "OneWorld"
- [ ] "Star Alliance"
- [x] "SkyTeam"

***See detailed answer***

        db.air_routes.aggregate([
            {
                $match: {
                    airplane: /747|380/
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
                $unwind: "$alliance"
            },
            {
                $group: {
                    _id: "$alliance.name",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
            ])

We begin by aggregating over our air_routes collection to allow for filtering of documents containing the string "747" or "380". If we started from air_alliances we would have to do this after the lookup!

        {
            $match: {
                airplane: /747|380/
            }
        },

Next, we use the $lookup stage to match documents from air_alliances on the value of their airlines field against the current document's airline.name field

        {
            $lookup: {
                from: "air_alliances",
                foreignField: "airlines",
                localField: "airline.name",
                as: "alliance"
            }
        },

We then use $unwind on the alliance field we created in $lookup, creating a document with each entry in alliance

        {
            $unwind: "$alliance"
        },

We end with a $group and $sort stage, grouping on the name of the alliance and counting how many times it appeared

        {
            $group: {
                _id: "$alliance.name",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }

This produces the following output

        { "_id" : "SkyTeam", "count" : 16 }
        { "_id" : "Star Alliance", "count" : 11 }
        { "_id" : "OneWorld", "count" : 11 }

## 3.2 $graphLookup Introduction

### Quiz

Problem: 

Which of the following statements apply to $graphLookup operator? check all that apply

- [ ] $graphLookup is a new stage of the aggregation pipeline introduced in MongoDB 3.2
- [x] $graphLookup provides MongoDB a transitive closure implementation
- [x] Provides MongoDB with graph or graph-like capabilities
- [ ] $graphLookup depends on $lookup operator. Cannot be used without $lookup
- [ ] $lookup and $graphLookup stages require the exact same fields in their specification.

## 3.4 $graphLookup: Simple Lookup

### Quiz

Problem: 

Which of the following statements is/are correct? Check all that apply.

- [x] connectFromField value will be use to match connectToField in a recursive match
- [x] connectToField will be used on recursive find operations
- [ ] startWith indicates the index that should be use to execute the recursive match
- [ ] as determines a collection where $graphLookup will store the stage results

## 3.5 $graphLookup: maxDepth and depthField

### Quiz

Problem: 

Which of the following statements are incorrect? Check all that apply

- [ ] depthField determines a field, in the result document, which specifies the number of recursive lookup needed to reach that document
- [x] maxDepth only takes $long values
- [x] depthField determines a field, which contains the value number of documents matched by the recursive lookup
- [ ] maxDepth allows to specify the number of recursive lookups

## 3.6 $graphLookup: General Considerations

### Quiz

Problem:

Consider the following statement:

        ``$graphLookup`` is required to be the last element on the pipeline.

Which of the following is true about the statement?

- [ ] This is correct because $graphLookup pipes out the results of recursive search into a collection, similar to $out stage.
- [x] This is incorrect. $graphLookup can be used in any position of the pipeline and acts in the same way as a regular $lookup.
- [ ] This is incorrect. graphLookup needs to be the first element of the pipeline, regardless of other stages needed to perform the desired query.
- [ ] This is correct because of the recursive nature of $graphLookup we want to save resources for last.

## Lab: $graphLookup

### Problem

Now that you have been introduced to $graphLookup, let's use it to solve an interesting need. You are working for a travel agency and would like to find routes for a client! For this exercise, we'll be using the air_airlines, air_alliances, and air_routes collections in the aggregations database.

The air_airlines collection will use the following schema:

        {
            "_id" : ObjectId("56e9b497732b6122f8790280"),
            "airline" : 4,
            "name" : "2 Sqn No 1 Elementary Flying Training School",
            "alias" : "",
            "iata" : "WYT",
            "icao" : "",
            "active" : "N",
            "country" : "United Kingdom",
            "base" : "HGH"
        }

The air_routes collection will use this schema:

        {
            "_id" : ObjectId("56e9b39b732b6122f877fa31"),
            "airline" : {
                    "id" : 410,
                    "name" : "Aerocondor",
                    "alias" : "2B",
                    "iata" : "ARD"
            },
            "src_airport" : "CEK",
            "dst_airport" : "KZN",
            "codeshare" : "",
            "stops" : 0,
            "airplane" : "CR2"
        }

Finally, the air_alliances collection will show the airlines that are in each alliance, with this schema:

        {
            "_id" : ObjectId("581288b9f374076da2e36fe5"),
            "name" : "Star Alliance",
            "airlines" : [
                    "Air Canada",
                    "Adria Airways",
                    "Avianca",
                    "Scandinavian Airlines",
                    "All Nippon Airways",
                    "Brussels Airlines",
                    "Shenzhen Airlines",
                    "Air China",
                    "Air New Zealand",
                    "Asiana Airlines",
                    "Brussels Airlines",
                    "Copa Airlines",
                    "Croatia Airlines",
                    "EgyptAir",
                    "TAP Portugal",
                    "United Airlines",
                    "Turkish Airlines",
                    "Swiss International Air Lines",
                    "Lufthansa",
                    "EVA Air",
                    "South African Airways",
                    "Singapore Airlines"
            ]
        }

Determine the approach that satisfies the following question in the most efficient manner:

>Find the list of all possible distinct destinations, with at most one layover, departing from the base airports of airlines that make part of the "OneWorld" alliance. The airlines should be national carriers from Germany, Spain or Canada only. Include both the destination and which airline services that location. As a small hint, you should find 158 destinations.

Select the correct pipeline from the following set of options:

- [ ] `var airlines = [];
db.air_alliances.find({"name": "OneWorld"}).forEach(function(doc){
  airlines = doc.airlines
})
var oneWorldAirlines = db.air_airlines.find({"name": {"$in": airlines}})
oneWorldAirlines.forEach(function(airline){
  db.air_alliances.aggregate([
  {"$graphLookup": {
    "startWith": airline.base,
    "from": "air_routes",
    "connectFromField": "dst_airport",
    "connectToField": "src_airport",
    "as": "connections",
    "maxDepth": 1
  }}])
})`
- [x] `db.air_alliances.aggregate([{
  $match: { name: "OneWorld" }
}, {
  $graphLookup: {
    startWith: "$airlines",
    from: "air_airlines",
    connectFromField: "name",
    connectToField: "name",
    as: "airlines",
    maxDepth: 0,
    restrictSearchWithMatch: {
      country: { $in: ["Germany", "Spain", "Canada"] }
    }
  }
}, {
  $graphLookup: {
    startWith: "$airlines.base",
    from: "air_routes",
    connectFromField: "dst_airport",
    connectToField: "src_airport",
    as: "connections",
    maxDepth: 1
  }
}, {
  $project: {
    validAirlines: "$airlines.name",
    "connections.dst_airport": 1,
    "connections.airline.name": 1
  }
},
{ $unwind: "$connections" },
{
  $project: {
    isValid: { $in: ["$connections.airline.name", "$validAirlines"] },
    "connections.dst_airport": 1
  }
},
{ $match: { isValid: true } },
{ $group: { _id: "$connections.dst_airport" } }
])`
- [ ] `db.air_routes.aggregate(
  [
    {"$lookup": {
      "from": "air_alliances",
      "foreignField": "airlines",
      "localField": "airline.name",
      "as": "alliance"
    }},
    {"$match": {"alliance.name": "OneWorld"}},
    {"$lookup": {
      "from": "air_airlines",
      "foreignField": "name",
      "localField": "airline.name",
      "as": "airline"
    }},
    {"$graphLookup": {
      "startWith": "$airline.base",
      "from": "air_routes",
      "connectFromField": "dst_airport",
      "connectToField": "src_airport",
      "as": "connections",
      "maxDepth": 1
    }},
    {"$project":{ "connections.dst_airport": 1 }},
    {"$unwind": "$connections"},
    {"$group": { "_id": "$connections.dst_airport" }}
  ]
)`
- [ ] `db.air_airlines.aggregate(
  [
    {"$match": {"country": {"$in": ["Spain", "Germany", "Canada"]}}},
    {"$lookup": {
      "from": "air_alliances",
      "foreignField": "airlines",
      "localField": "name",
      "as": "alliance"
    }},
    {"$match": {"alliance.name": "OneWorld"}},
    {"$graphLookup": {
      "startWith": "$base",
      "from": "air_routes",
      "connectFromField": "dst_airport",
      "connectToField": "src_airport",
      "as": "connections",
      "maxDepth": 1
    }},
    {"$project":{ "connections.dst_airport": 1 }},
    {"$unwind": "$connections"},
    {"$group": { "_id": "$connections.dst_airport" }}
  ]
)`

***See detailed answer***

For this lab the correct answer would be

        db.air_alliances.aggregate([
        {
            $match: { name: "OneWorld" }
        },
        {
            $graphLookup: {
            startWith: "$airlines",
            from: "air_airlines",
            connectFromField: "name",
            connectToField: "name",
            as: "airlines",
            maxDepth: 0,
            restrictSearchWithMatch: {
                country: { $in: ["Germany", "Spain", "Canada"] }
            }
            }
        },
        {
            $graphLookup: {
            startWith: "$airlines.base",
            from: "air_routes",
            connectFromField: "dst_airport",
            connectToField: "src_airport",
            as: "connections",
            maxDepth: 1
            }
        },
        {
            $project: {
            validAirlines: "$airlines.name",
            "connections.dst_airport": 1,
            "connections.airline.name": 1
            }
        },
        { $unwind: "$connections" },
        {
            $project: {
            isValid: {
                $in: ["$connections.airline.name", "$validAirlines"]
            },
            "connections.dst_airport": 1
            }
        },
        { $match: { isValid: true } },
        {
            $group: {
            _id: "$connections.dst_airport"
            }
        }
        ])

This pipeline takes the most selective collection first, air_alliances, matching the document refering to the OneWorld alliance.

        db.air_alliances.aggregate([
        {
             $match: { name: "OneWorld" }
        }

It then iterates, with maxDepth 0 on the air_airlines collection to collect the details on the airlines, specially their base airport, but restricting that $lookup to airlines of the requested countries [Spain, Germany, Canada], using restrictSearchWithMatch.

        {
            $graphLookup: {
                startWith: "$airlines",
                from: "air_airlines",
                connectFromField: "name",
                connectToField: "name",
                as: "airlines",
                maxDepth: 0,
                restrictSearchWithMatch: {
                country: { $in: ["Germany", "Spain", "Canada"] }
                }
            }
        }

We then iterate over all routes up to maximum of one layover by setting our maxDepth to 1. We find all possible destinations when departing from the base airport of each carrier by specify $airlines.base in startWith

        {
            $graphLookup: {
                startWith: "$airlines.base",
                from: "air_routes",
                connectFromField: "dst_airport",
                connectToField: "src_airport",
                as: "connections",
                maxDepth: 1
            }
        }

We now have a document with a field named connections that is an array of all routes that are within 1 layover. We use a $project here to remove unnecessary information from the documents. We also need to include information about valid airlines that match our initial restriction and the name of the current airline.

        {
            $project: {
                validAirlines: "$airlines.name",
                "connections.dst_airport": 1,
                "connections.airline.name": 1
            }
        }

After this, we'll unwind our connections array, and then use $project to add a field representing whether this particular route is valid, meaning it is a route flown by one of our desired carriers.

        { $unwind: "$connections" },
        {
            $project: {
                isValid: {
                    $in: ["$connections.airline.name", "$validAirlines"]
                },
                "connections.dst_airport": 1
            }
        }

Lastly, we use $match to filter out invalid routes, and then $group them on the destination.

        { $match: { isValid: true } },
        {
            $group: {
                _id: "$connections.dst_airport"
            }
        }

An important aspect to this pipeline is that the first $graphLookup will act as a regular $lookup since we are setting a maxDepth to zero. The reason why we are taking this approach is due to the match restriction that $graphLookup allows, which can make this stage more efficient. Think back to the earlier lab on $lookup, can you think of a way to simplify the aggregation using $graphLookup instead?

# Lectures

- [$group](https://docs.mongodb.com/manual/reference/operator/aggregation/group/)
- [accumulator expressions](https://docs.mongodb.com/manual/reference/operator/aggregation/#group-accumulator-operators)
- [$unwind](https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/)
- [$lookup](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/)