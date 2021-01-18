// an initial aggregatioin finding all movies where the title begins
// with a vowel. Notice the $project stage that will prevent a covered
// query!
db.movies.aggregate([
  {
    $match: {
      title: /^[aeiou]/i
    }
  },
  {
    $project: {
      title_size: { $size: { $split: ["$title", " "] } }
    }
  },
  {
    $group: {
      _id: "$title_size",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
])

// showing the query isn't covered
db.movies.aggregate(
  [
    {
      $match: {
        title: /^[aeiou]/i
      }
    },
    {
      $project: {
        title_size: { $size: { $split: ["$title", " "] } }
      }
    },
    {
      $group: {
        _id: "$title_size",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ],
  { explain: true }
)

// this is better, we are projecting away the _id field. But this seems like
// a lot of manual work...
db.movies.aggregate([
  {
    $match: {
      title: /^[aeiou]/i
    }
  },
  {
    $project: {
      _id: 0,
      title_size: { $size: { $split: ["$title", " "] } }
    }
  },
  {
    $group: {
      _id: "$title_size",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
])

// verifying that it is a covered query
db.movies.aggregate(
  [
    {
      $match: {
        title: /^[aeiou]/i
      }
    },
    {
      $project: {
        _id: 0,
        title_size: { $size: { $split: ["$title", " "] } }
      }
    },
    {
      $group: {
        _id: "$title_size",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ],
  { explain: true }
)

// can we... do this? Yes, yes we can.
db.movies.aggregate([
  {
    $match: {
      title: /^[aeiou]/i
    }
  },
  {
    $group: {
      _id: {
        $size: { $split: ["$title", " "] }
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
])

// proof
db.movies.aggregate(
  [
    {
      $match: {
        title: /^[aeiou]/i
      }
    },
    {
      $group: {
        _id: {
          $size: { $split: ["$title", " "] }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ],
  { explain: true }
)

// and a very succinct way of expressing what we wanted all along
db.movies.aggregate([
  {
    $match: {
      title: /^[aeiou]/i
    }
  },
  {
    $sortByCount: {
      $size: { $split: ["$title", " "] }
    }
  }
])

// a naive way to get teh number of trades by action. We unwind the trades
// array first thing. We get the results we want, but maybe there is a better
// way
db.stocks.aggregate([
  {
    $unwind: "$trades"
  },
  {
    $group: {
      _id: {
        time: "$id",
        action: "$trades.action"
      },
      trades: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: "$_id.time",
      actions: {
        $push: {
          type: "$_id.action",
          count: "$trades"
        }
      },
      total_trades: { $sum: "$trades" }
    }
  },
  {
    $sort: { total_trades: -1 }
  }
])

// working within the arrays is always better if we want to do analysis within
// a document. We get the same results in a slighlty easier to work with format
// and didn't incur the cost of a $group stage
db.stocks.aggregate([
  {
    $project: {
      buy_actions: {
        $size: {
          $filter: {
            input: "$trades",
            cond: { $eq: ["$$this.action", "buy"] }
          }
        }
      },
      sell_actions: {
        $size: {
          $filter: {
            input: "$trades",
            cond: { $eq: ["$$this.action", "sell"] }
          }
        }
      },
      total_trades: { $size: "$trades" }
    }
  },
  {
    $sort: { total_trades: -1 }
  }
])

// remember, expression composition is powerful. Be creative, and things
// that can be done inline. Notice that there is no intermediary stage to
// filter the trades array first, it's just done as part of the argument to
// the reduce expression.

db.stocks.aggregate([
  {
    $project: {
      _id: 0,
      mdb_only: {
        $reduce: {
          input: {
            $filter: {
              input: "$trades",
              cond: { $eq: ["$$this.ticker", "MDB"] }
            }
          },
          initialValue: {
            buy: { total_count: 0, total_value: 0 },
            sell: { total_count: 0, total_value: 0 }
          },
          in: {
            $cond: [
              { $eq: ["$$this.action", "buy"] },
              {
                buy: {
                  total_count: { $add: ["$$value.buy.total_count", 1] },
                  total_value: {
                    $add: ["$$value.buy.total_value", "$$this.price"]
                  }
                },
                sell: "$$value.sell"
              },
              {
                sell: {
                  total_count: { $add: ["$$value.sell.total_count", 1] },
                  total_value: {
                    $add: ["$$value.sell.total_value", "$$this.price"]
                  }
                },
                buy: "$$value.buy"
              }
            ]
          }
        }
      }
    }
  }
])
