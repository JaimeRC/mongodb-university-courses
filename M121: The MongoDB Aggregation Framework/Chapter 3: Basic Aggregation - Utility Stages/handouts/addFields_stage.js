// reassign ``gravity`` field value
db.solarSystem.aggregate([{"$project": { "gravity": "$gravity.value" } }]);

// adding ``name`` and removing ``_id`` from projection
db.solarSystem.aggregate([{"$project": { "_id": 0, "name": 1, "gravity": "$gravity.value" } }])

// adding more fields to the projected document
db.solarSystem.aggregate([
{"$project":{
    "_id": 0,
    "name": 1,
    "gravity": "$gravity.value",
    "meanTemperature": 1,
    "density": 1,
    "mass": "$mass.value",
    "radius": "$radius.value",
    "sma": "$sma.value" }
}]);

// using ``$addFields`` to generate the new computed field values
db.solarSystem.aggregate([
{"$addFields":{
    "gravity": "$gravity.value",
    "mass": "$mass.value",
    "radius": "$radius.value",
    "sma": "$sma.value"}
}]);

// combining ``$project`` with ``$addFields``
db.solarSystem.aggregate([
{"$project": {
    "_id": 0,
    "name": 1,
    "gravity": 1,
    "mass": 1,
    "radius": 1,
    "sma": 1}
},
{"$addFields": {
    "gravity": "$gravity.value",
    "mass": "$mass.value",
    "radius": "$radius.value",
    "sma": "$sma.value"
}}]);
