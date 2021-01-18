// using bucketAuto to calculate buckets for us
db.movies.aggregate([
  {
    "$bucketAuto": {
      "groupBy": "$imdb.rating",
      "buckets": 4,
      "output": {
        "average_per_bucket": { "$avg": "$imdb.rating" },
        "count": { "$sum": 1 }
      }
    }
  }
])

// cleaning up the bucket boundaries by filtering out documents without an
// imdb.rating field or a field that isn't numeric
db.movies.aggregate([
  {
    "$match": { "imdb.rating": { "$gte": 0 } }
  },
  {
    "$bucketAuto": {
      "groupBy": "$imdb.rating",
      "buckets": 4,
      "output": {
        "average_per_bucket": { "$avg": "$imdb.rating" },
        "count": { "$sum": 1 }
      }
    }
  }
])

// cardinality matters! Documents with the same value in the groupBy expression
// **must** be put into the same bucket, meaning we may not get an even
// distribution among buckets. This uses the title field to groupBy, a much more
// unique value
db.movies.aggregate([
  {
    "$bucketAuto": {
      "groupBy": "$title",
      "buckets": 4
    }
  }
])

// granularity testing

// this is the function used in the video to generate the test collection
function make_granularity_values() {
  for (let i = 0; i < 100; i++) {
    db.granularity_test.insertOne({
      "powers_of_2": Math.pow(2, Math.floor(Math.random() * 10)),
      "renard_and_e": Math.random() * 10
    })
  }
}

// testing powers of 2 granularity distributioin
db.granularity_test.aggregate([
  {
    "$bucketAuto": {
      "groupBy": "$powers_of_2",
      "buckets": 10,
      "granularity": "POWERSOF2"
    }
  }
])
