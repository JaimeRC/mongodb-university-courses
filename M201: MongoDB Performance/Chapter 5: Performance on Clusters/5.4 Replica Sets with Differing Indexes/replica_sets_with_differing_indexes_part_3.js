// shutdown the secondary with priority 0
use admin
db.shutdownServer()


// after reconnecting to the standalone node, confirm that it's standalone
rs.status()

// switch to the m201 database
use m201

// create a new index
db.restaurants.createIndex({ "cuisine": 1, "address.street":1, "address.city": 1, "address.state": 1, "address.zipcode": 1 })

// run a query that will use the new index
db.restaurants.find({  cuisine: /Medi/, "address.zipcode": /6/   }).explain()

// shutdown the server again
use admin
db.shutdownServer()


// on the primary, rerun the last query (doesn't use our index)
db.restaurants.find({  cuisine: /Medi/, "address.zipcode": /6/   }).explain()

// connect to our passive node
db = connect("127.0.0.1:27002/m201")

// enable secondary reads
db.setSlaveOk()

// confirm that we can still use the new index on the secondary
db.restaurants.find({  cuisine: /Medi/, "address.zipcode": /6/   }).explain()