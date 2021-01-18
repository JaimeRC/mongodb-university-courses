// creating a variable to refer against
var userAccess = "Management"

// comparing whether the value/s in the userAccess variable are in the array
// referenced by the $acl field path
db.employees
  .aggregate([
    {
      "$redact": {
        "$cond": [{ "$in": [userAccess, "$acl"] }, "$$DESCEND", "$$PRUNE"]
      }
    }
  ])
  .pretty()
