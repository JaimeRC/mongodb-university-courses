# Chapter 3: Basic Aggregation - Utility Stages

# Lab: Using Cursor-like Stages

## Problem

MongoDB has another movie night scheduled. This time, we polled employees for their favorite actress or actor, and got these results

        favorites = [
            "Sandra Bullock",
            "Tom Hanks",
            "Julia Roberts",
            "Kevin Spacey",
            "George Clooney"
            ]

For movies released in the USA with a tomatoes.viewer.rating greater than or equal to 3, calculate a new field called num_favs that represets how many favorites appear in the cast field of the movie.

Sort your results by num_favs, tomatoes.viewer.rating, and title, all in descending order.

What is the title of the 25th film in the aggregation result?

- [ ] Recount
- [ ] Erin Brockovich
- [ ] Wrestling Ernest Hemingway
- [x] The Heat

***See detailed answer***

        var favorites = [
            "Sandra Bullock",
            "Tom Hanks",
            "Julia Roberts",
            "Kevin Spacey",
            "George Clooney"
            ]

        db.movies.aggregate([
            {
                $match: {
                    "tomatoes.viewer.rating": { $gte: 3 },
                    countries: "USA",
                    cast: {$in: favorites}
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    "tomatoes.viewer.rating": 1,
                    num_favs: {
                        $size: {
                            $setIntersection: [
                                "$cast",
                                favorites
                                ]
                        }
                    }
                }
            ,
            {
                $sort: { num_favs: -1, "tomatoes.viewer.rating": -1, title: -1 }
            },
            {
                $skip: 24
            },  
            {
                $limit: 1
            }
            ])

We store our favorites in a variable for easy reference within the pipeline

        var favorites = [
            "Sandra Bullock",
            "Tom Hanks",
            "Julia Roberts",
            "Kevin Spacey",
            "George Clooney"
        ]

We start by matching films that include at least one of our favorites in their cast

        {
            $match: {
                "tomatoes.viewer.rating": { $gte: 3 },
                countries: "USA",
                cast: { $in: favorites }
            }
        }
Then, we will be projecting the num_favs value by calculating the $size of the array intersection, between the given set of favorites and the film cast:

        {
            $project: {
                _id: 0,
                title: 1,
                "tomatoes.viewer.rating": 1,
                starPower: {
                    $size: { $setIntersection: favorites}
                }
            }
        }

After that, we call the $sort stage and $skip + $limit in the result to the element requested:

        {
            $sort: { num_favs: -1, "tomatoes.viewer.rating": -1, title: -1 }
        },
        {
            $skip: 24
        },
        {
            $limit: 1
        }
        ])

# Lab - Bringing it all together

## Problem

Calculate an average rating for each movie in our collection where English is an available language, the minimum imdb.rating is at least 1, the minimum imdb.votes is at least 1, and it was released in 1990 or after. You'll be required to rescale (or normalize) imdb.votes. The formula to rescale imdb.votes and calculate normalized_rating is included as a handout.

What film has the lowest normalized_rating?

- [ ] Twilight
- [x] The Christmas Tree
- [ ] Avatar: The Last Airbender
- [ ] DMZ

***See detailed answer***

One possible solution is below.

        db.movies.aggregate([
            {
                $match: {
                year: { $gte: 1990 },
                languages: { $in: ["English"] },
                "imdb.votes": { $gte: 1 },
                "imdb.rating": { $gte: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    "imdb.rating": 1,
                    "imdb.votes": 1,
                    normalized_rating: {
                        $avg: [
                            "$imdb.rating",
                                {
                                $add: [
                                    1,
                                    {
                                        $multiply: [
                                            9,
                                            {
                                                $divide: [
                                                    { $subtract: ["$imdb.votes", 5] },
                                                    { $subtract: [1521105, 5] }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                        }
                    }
                },
                { $sort: { normalized_rating: 1 } },
                { $limit: 1 }
            ])

We start by applying the $match filtering:

        {
            $match: {
                year: { $gte: 1990 },
                languages: { $in: ["English"] },
                "imdb.votes": { $gte: 1 },
                "imdb.rating": { $gte: 1 }
            }
        }

And within the $project stage we apply the scaling and normalizating calculations:

        {
        $project: {
            _id: 0,
            title: 1,
            "imdb.rating": 1,
            "imdb.votes": 1,
            normalized_rating: {
            $avg: [
                "$imdb.rating",
                {
                $add: [
                    1,
                    {
                    $multiply: [
                        9,
                        {
                        $divide: [
                            { $subtract: ["$imdb.votes", 5] },
                            { $subtract: [1521105, 5] }
                        ]
                        }
                    ]
                    }
                ]
                }
            ]
            }
        }
        },
        
in a new computed field normalized_rating.

The first element of the result, after sorting by normalized_rating is The Christmas Tree, the expected correct answer.

# Lectures

- [$addFields](https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/)
- [$geoNear](https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/)
- [$sample](https://docs.mongodb.com/manual/reference/operator/aggregation/sample/)