# Chapter 2: Basic Aggregation - $match and $project

## 2.1 $match: Filtering documents

### Quiz

Problem:

Which of the following is/are true of the $match stage?

- [ ] $match can only filter documents on one field.
- [x] It uses the familiar MongoDB query language.
- [ ] $match can use both query operators and aggregation expressions.
- [x] It should come very early in an aggregation pipeline.

***See detailed answer***

The correct answers are:

- It uses the familiar MongoDB query language.

$match uses the MongoDB query language query operators to express queries.

- It should come very early in an aggregation pipeline.

The earlier in the pipeline, the more efficient our pipelines will become. Not only because we will expression filters that reduce the number of documents to process, but also the fact that we might be using indexes withing the pipeline execution.

The remaining options are not correct.





## 2.2 Lab - $match

### Problem

Help MongoDB pick a movie our next movie night! Based on employee polling, we've decided that potential movies must meet the following criteria.

- imdb.rating is at least 7
- genres does not contain "Crime" or "Horror"
- rated is either "PG" or "G"
- languages contains "English" and "Japanese"
  
Assign the aggregation to a variable named pipeline, like:

        var pipeline = [ { $match: { ... } } ]

- As a hint, your aggregation should return 23 documents. You can verify this by typing db.movies.aggregate(pipeline).itcount()
- Load validateLab1.js into mongo shell

        load('validateLab1.js')

- And run the validateLab1 validation method

        validateLab1(pipeline)

What is the answer?

- [ ] 30
- [ ] 12
- [x] 15
- [ ] 7

***See detailed answer***

You can use nearly all of the familiar query operators in $match. We filter documents, retaining only those where the imdb.rating is 7 or more, genres does not include "Crime" or "Horror", the value for rated was "PG" or "G", and languages includes both "English" and "Japanese". .. code-block:

        var pipeline = [{
            $match: {
                "imdb.rating": { $gte: 7 },
                genres: { $nin: [ "Crime", "Horror" ] } ,
                rated: { $in: ["PG", "G" ] },
                languages: { $all: [ "English", "Japanese" ]}
            }
        }]

## 2.3 Shaping documents with $project

### Quiz

Problem:

Which of the following statements are true of the $project stage?

- [x] Once we specify a field to retain or perform some computation in a $project stage, we must specify all fields we wish to retain. The only exception to this is the _id field.
- [x] Beyond simply removing and retaining fields, $project lets us add new fields.
- [ ] $project can only be used once within an Aggregation pipeline.
- [ ] $project cannot be used to assign new values to existing fields.

***See detailed answer***

The correct answers are the following:

- Once we specify a field to retain or perform some computation in a $project stage, we must specify all fields we wish to retain. The only exception to this is the _id field.

$project implicitly removes all other fields once we have retained, reshaped, or computed a new field. The exception to this is the _id field, which we must explicitly remove.

- Beyond simply removing and retaining fields, $project lets us add new fields.
  
We can add new fields and reassign the values of existing ones, shaping the documents into different datastructures and computing values using expressions.

The remaining options are incorrect.


## Lab - Changing Document Shape with $project

### Problem

Our first movie night was a success. Unfortunately, our ISP called to let us know we're close to our bandwidth quota, but we need another movie recommendation!

Using the same $match stage from the previous lab, add a $project stage to only display the the title and film rating (title and rated fields).

- Assign the results to a variable called pipeline.

        var pipeline = [{ $match: {. . .} }, { $project: { . . . } }]

- Load validateLab2.js which was included in the same handout as validateLab1.js and execute validateLab2(pipeline)?
  
        load('./validateLab2.js')

- And run the validateLab2 validation method

        validateLab2(pipeline)

What is the answer?

- [ ] 4
- [ ] 7
- [x] 15
- [ ] 30

***See detailed answer***

Remember that when using $project to be selective on which fields you pass further, the only field you must specify to remove is _id. When you specify a field to retain (title: 1), $project assumes that all other fields you haven't specified to retain should be removed.

        var pipeline = [{
            $match: {
                "imdb.rating": { $gte: 7 },
                genres: { $nin: [ "Crime", "Horror" ] } ,
                rated: { $in: ["PG", "G" ] },
                languages: { $all: [ "English", "Japanese" ]}
            }
        },
        {
            $project: { _id: 0, title: 1, "rated": 1 }
        }]


## Lab - Computing Fields

### Problem

Our movies dataset has a lot of different documents, some with more convoluted titles than others. If we'd like to analyze our collection to find movie titles that are composed of only one word, we could fetch all the movies in the dataset and do some processing in a client application, but the Aggregation Framework allows us to do this on the server!

Using the Aggregation Framework, find a count of the number of movies that have a title composed of one word. To clarify, "Cinderella" and "3-25" should count, where as "Cast Away" would not.

Make sure you look into the [`$split String expression`](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#string-expressions) and the [`$size Array expression`](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#array-expressions)

To get the count, you can append itcount() to the end of your pipeline

        db.movies.aggregate([...]).itcount()

- [ ] 144
- [x] 8068
- [ ] 9447
- [ ] 12373

***See detailed answer***

        db.movies.aggregate([
        {
            $match: {
            title: {
                $type: "string"
            }
            }
        },
        {
            $project: {
            title: { $split: ["$title", " "] },
            _id: 0
            }
        },
        {
            $match: {
            title: { $size: 1 }
            }
        }
        ]).itcount()

We begin with a $match stage, ensuring that we only allow movies where the title is a string

        db.movies.aggregate([
        {
            $match: {
                title: {
                   $type: "string"
                }
            }
        },

Next is our $project stage, splitting the title on spaces. This creates an array of strings

        {
             $project: {
                title: { $split: ["$title", " "] },
                _id: 0
            }
        },

We use another $match stage to filter down to documents that only have one element in the newly computed title field, and use itcount() to get a count

        {
            $match: {
                title: { $size: 1 }
            }
        }
        ]).itcount()

## Optional Lab - Expressions with $project

This lab will have you work with data within arrays, a common operation.

Specifically, one of the arrays you'll work with is writers, from the movies collection.

There are times when we want to make sure that the field is an array, and that it is not empty. We can do this within $match

        { $match: { writers: { $elemMatch: { $exists: true } } }

However, the entries within writers presents another problem. A good amount of entries in writers look something like the following, where the writer is attributed with their specific contribution

        "writers" : [ "Vincenzo Cerami (story)", "Roberto Benigni (story)" ]

But the writer also appears in the cast array as "Roberto Benigni"!

Give it a look with the following query

        db.movies.findOne({title: "Life Is Beautiful"}, { _id: 0, cast: 1, writers: 1})

This presents a problem, since comparing "Roberto Benigni" to "Roberto Benigni (story)" will definitely result in a difference.

Thankfully there is a powerful expression to help us, $map. $map lets us iterate over an array, element by element, performing some transformation on each element. The result of that transformation will be returned in the same place as the original element.

Within $map, the argument to input can be any expression as long as it resolves to an array. The argument to as is the name of the variable we want to use to refer to each element of the array when performing whatever logic we want. The field as is optional, and if omitted each element must be referred to as $$this:: The argument to in is the expression that is applied to each element of the input array, referenced with the variable name specified in as, and prepending two dollar signs:

        writers: {
           $map: {
                input: "$writers",
                as: "writer",
                in: "$$writer"

in is where the work is performed. Here, we use the $arrayElemAt expression, which takes two arguments, the array and the index of the element we want. We use the $split expression, splitting the values on " (".

If the string did not contain the pattern specified, the only modification is it is wrapped in an array, so $arrayElemAt will always work

        writers: {
            $map: {
                input: "$writers",
                as: "writer",
                in: {
                $arrayElemAt: [
                    {
                        $split: [ "$$writer", " (" ]
                    },
                    0
                ]
                }
            }
        }

### Problem:

Let's find how many movies in our movies collection are a "labor of love", where the same person appears in cast, directors, and writers

Note that you may have a dataset that has duplicate entries for some films. Don't worry if you count them few times, meaning you should not try to find those duplicates.

To get a count after you have defined your pipeline, there are two simple methods.

        // add the $count stage to the end of your pipeline
        // you will learn about this stage shortly!
        db.movies.aggregate([
            {$stage1},
            {$stage2},
            ...$stageN,
            { $count: "labors of love" }
        ])

        // or use itcount()
        db.movies.aggregate([
            {$stage1},
            {$stage2},
            {...$stageN},
        ]).itcount()

How many movies are "labors of love"?

- [ ] 1263
- [x] 1597
- [ ] 1595
- [ ] 1259

***See detailed answer***

One solution is below.

        db.movies.aggregate([
        {
            $match: {
            cast: { $elemMatch: { $exists: true } },
            directors: { $elemMatch: { $exists: true } },
            writers: { $elemMatch: { $exists: true } }
            }
        },
        {
            $project: {
            _id: 0,
            cast: 1,
            directors: 1,
            writers: {
                $map: {
                input: "$writers",
                as: "writer",
                in: {
                    $arrayElemAt: [
                    {
                        $split: ["$$writer", " ("]
                    },
                    0
                    ]
                }
                }
            }
            }
        },
        {
            $project: {
            labor_of_love: {
                $gt: [
                { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
                0
                ]
            }
            }
        },
        {
            $match: { labor_of_love: true }
        },
        {
            $count: "labors of love"
        }
        ])

With our first $match stage, we filter out documents that are not an array or have an empty array for the fields we are interested in.

        {
            $match: {
                cast: { $elemMatch: { $exists: true } },
                directors: { $elemMatch: { $exists: true } },
                writers: { $elemMatch: { $exists: true } }
            }
        },

Next is a $project stage, removing the _id field and retaining both the directors and cast fields. We replace the existing writers field with a new computed value, cleaning up the strings within writers

        {
            $project: {
               _id: 0,
                cast: 1,
                directors: 1,
                writers: {
                    $map: {
                        input: "$writers",
                        as: "writer",
                        in: {
                        $arrayElemAt: [
                            {
                            $split: ["$$writer", " ("]
                            },
                            0
                        ]
                        }
                    }
                }
            }
            }
        }
        },

We use another $project stage to computer a new field called labor_of_love that ensures the intersection of cast, writers, and our newly cleaned directors is greater than 0. This definitely means that at least one element in each array is identical! $gt will return true or false.

        {
        $project: {
            labor_of_love: {
                $gt: [
                    { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
                    0
                ]
            }
        }
        },

Lastly, we follow with a $match stage, only allowing documents through where labor_of_love is true. In our example we use a $match stage, but itcount() works too.

        {
            $match: { labor_of_love: true }
        },
        {
            $count: "labors of love"
        }

        // or

        {
            $match: { labor_of_love: true }
        }
        ]).itcount()

This produces 1597, as expected.


# Lectures

- [$match](https://docs.mongodb.com/manual/reference/operator/aggregation/match/)
- [$project](https://docs.mongodb.com/manual/reference/operator/aggregation/project/)