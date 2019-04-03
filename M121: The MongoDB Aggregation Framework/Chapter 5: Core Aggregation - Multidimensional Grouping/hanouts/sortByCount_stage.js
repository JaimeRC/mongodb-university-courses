// performing a group followed by a sort to rank occurence
db.movies.aggregate([
  {
    "$group": {
      "_id": "$imdb.rating",
      "count": { "$sum": 1 }
    }
  },
  {
    "$sort": { "count": -1 }
  }
])

// sortByCount is equivalent to the above. In fact, if you execute this pipeline
// with { explain: true } you will see that it is transformed to the above!
db.movies.aggregate([
  {
    "$sortByCount": "$imdb.rating"
  }
])
