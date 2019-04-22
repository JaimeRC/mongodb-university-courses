db.people.findOne();  // see what the documents look like
db.people.getIndexes(); // see the index we've built already
db.people.createIndex({"ssn":1});  // build another index
exit  // leave the primary

// On the secondary on port 30001
rs.slaveOk();  // permission to read from a secondary
db.people.getIndexes()
exit  // leave the server on port 30001

// drop the index, then rebuild in the background.
db.people.dropIndex({"ssn":1})
db.people.createIndex({"ssn":1},{"background":true})
exit

