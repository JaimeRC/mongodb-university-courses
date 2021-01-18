// run to get a view of the document schema
db.icecream_data.findOne()

// using $reduce to get the highest temperature
db.icecream_data.aggregate([
  {
    "$project": {
      "_id": 0,
      "max_high": {
        "$reduce": {
          "input": "$trends",
          "initialValue": -Infinity,
          "in": {
            "$cond": [
              { "$gt": ["$$this.avg_high_tmp", "$$value"] },
              "$$this.avg_high_tmp",
              "$$value"
            ]
          }
        }
      }
    }
  }
])

// performing the inverse, grabbing the lowest temperature
db.icecream_data.aggregate([
  {
    "$project": {
      "_id": 0,
      "min_low": {
        "$reduce": {
          "input": "$trends",
          "initialValue": Infinity,
          "in": {
            "$cond": [
              { "$lt": ["$$this.avg_low_tmp", "$$value"] },
              "$$this.avg_low_tmp",
              "$$value"
            ]
          }
        }
      }
    }
  }
])

// note that these two operations can be done with the following operations can
// be done more simply. The following two expressions are functionally identical

db.icecream_data.aggregate([
  { "$project": { "_id": 0, "max_high": { "$max": "$trends.avg_high_tmp" } } }
])

db.icecream_data.aggregate([
  { "$project": { "_id": 0, "min_low": { "$min": "$trends.avg_low_tmp" } } }
])

// getting the average and standard deviations of the consumer price index
db.icecream_data.aggregate([
  {
    "$project": {
      "_id": 0,
      "average_cpi": { "$avg": "$trends.icecream_cpi" },
      "cpi_deviation": { "$stdDevPop": "$trends.icecream_cpi" }
    }
  }
])

// using the $sum expression to get total yearly sales
db.icecream_data.aggregate([
  {
    "$project": {
      "_id": 0,
      "yearly_sales (millions)": { "$sum": "$trends.icecream_sales_in_millions" }
    }
  }
])
