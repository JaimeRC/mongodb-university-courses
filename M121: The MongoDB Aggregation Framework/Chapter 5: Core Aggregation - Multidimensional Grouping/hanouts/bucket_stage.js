// showing that without a default, this can error if values can't be resolved
db.movies.aggregate([
  {
    "$bucket": {
      "groupBy": "$imdb.rating",
      "boundaries": [0, 5, 8, Infinity]
    }
  }
])

// protecting against the error
db.movies.aggregate([
  {
    "$bucket": {
      "groupBy": "$imdb.rating",
      "boundaries:" [0, 5, 8, Infinity],
      "default": "not rated"
    }
  }
])

// using expressions to get the average per bucket
db.movies.aggregate([
  {
    "$bucket": {
      "groupBy": "$imdb.rating",
      "boundaries": [0, 5, 8, Infinity],
      "default": "not rated",
      "output": {
        "average_per_bucket": { "$avg": "$imdb.rating" }
      }
    }
  }
])

// to get the count per bucket after we have specified an output, we have to
// implicitly calculate it
db.movies.aggregate([
  {
    "$bucket": {
      "groupBy": "$imdb.rating",
      "boundaries": [0, 5, 8, Infinity],
      "default": "not rated",
      "output": {
        "average_per_bucket": { "$avg": "$imdb.rating" },
        "count": { "$sum": 1 }
      }
    }
  }
])
