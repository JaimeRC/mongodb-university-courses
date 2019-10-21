# Chapter 3: Patterns (Part 1)

## 3.1 Guide to Homework Validation

### Quiz

Please follow the steps outlined in this lecture and included in the lecture notes.

To run the validator for the example lab on Windows, run the following command:

    validate_m320 example --file answer_schema.json
 
To run the validator for the example lab on MacOS and Linux, run the following command:

    ./validate_m320 example --file answer_schema.json
 
Then, paste the validation code from the example lab into the text box below and hit the submit button.

***Enter answer here:***

    5d124f9bd971a774b97b5fc7
    
## 3.2 Handling Referential Integrity

### Quiz

Which of the following are valid concerns regarding duplication, staleness and referential integrity management in a MongoDB database and appropriate resolution techniques?

- [ ] Data duplication should not exist and can be avoided with multi-document transactions.
- [x] Data staleness issues can be minimized with frequent batch updates.
- [x] Data integrity issues can be minimized by using multi-document transactions.

***See detailed answer***
    
___Correct Options:___

- Data integrity issues can be minimized by using multi-document transactions.

When references are removed or changed, modify or remove the related documents. By doing all those changes at once in a multi-document transaction, all changes will either all occur or be aborted without leaving a subset of the changes done.

- Data staleness issues can be minimized with frequent batch updates.

The staleness of the data in a system can be reduced by incrementing the frequency at which updates on dependent or duplicated data is done. The minimum, or absence, of staleness happens when dependent or duplicated data is always updated when its source is changed.

___Incorrect Option:___

- Data duplication should not exist and can be avoided with multi-document transactions.

Data duplication is not always a bad thing. As shown in the lesson, there are cases where duplicated data would be prefered to keeping a single value of it.

## 3.3 Attribute Pattern

### Quiz

Which one of the following scenarios is best suited for the application of the Attribute Pattern?

- [ ] The documents need strict validation.
- [ ] The system is accessing the disk too frequently.
- [x] Some fields share a number of characteristics, and we want to search across those fields.
- [ ] The documents are large.
- [ ] The working set does not fit in memory.

***See detailed answer***

___Correct Option:___

-Some fields share a number of characteristics, and we want to search across those fields.

This is one of the main reason you should use this pattern. Alternatively to using the pattern for this situation, MongoDB introduces Wildcard Indexes that allow to index together a list of fields.

___Incorrect Options:___

- The working set does not fit in memory.

Having a single index for the attributes would save some memory, on disk and in RAM. However, if the multitude of indexes you originally had were of type "partial index", you may not see a significant difference in the amount of space.

- The documents are large.

Using the Attribute Pattern may give you a better organization of the fields in your documents, however, it does not reduce the size of the documents.

- The documents need strict validation.

While it is true that you would have a lot fewer field names to describe in your validator if you used the Attribute Pattern, it would not actually be much simpler as you are potentially moving the problem to a list of acceptable values for a given "k" field.

- The system is accessing the disk too frequently.

The Attribute Pattern is not going to be very helpful for this issue.

## Lab: Apply the Attribute Pattern

### Problem

___User Story___

The museum we work at has grown from a local attraction to one that is seen as having very popular items.

For this reason, other museums in the World have started exchanging pieces of art with our museum.

Our database was tracking if our pieces are on display and where they are in the museum.

To track the pieces we started exchanging with other museum, we added an array called events, in which we created an entry for each date a piece was loaned and the museum it was loaned to.
    
    {
      "_id": ObjectId("5c5348f5be09bedd4f196f18"),
      "title": "Cookies in the sky",
      "artist": "Michelle Vinci",
      "date_acquisition": ISODate("2017-12-25T00:00:00.000Z"),
      "location": "Blue Room, 20A",
      "on_display": false,
      "in_house": false,
      "events": [{
        "moma": ISODate("2019-01-31T00:00:00.000Z"),
        "louvres": ISODate("2020-01-01T00:00:00.000Z")
      }]
    }

The problem with this design is that we need to build a new index every time there is a new museum with which we start exchanging pieces. For example, when we started working with The Prado in Madrid, we needed to add this index:

    { "events.prado" : 1 }

---

___Task___

To address this issue, you've decided to change the schema to:

- use a single index on all event dates.
- transform the field that tracks the date when a piece was acquired, date_acquisition, so that it is also indexed with the values above.

To ensure the validator can verify your solution, use "k" and "v" as field names if needed.

To complete this lab:

- Modify the following schema to incorporate the above changes:
   
        {
          "_id": "<objectId>",
          "title": "<string>",
          "artist": "<string>",
          "date_acquisition": "<date>",
          "location": "<string>",
          "on_display": "<bool>",
          "in_house": "<bool>",
          "events": [{
            "moma": "<date>",
            "louvres": "<date>"
          }]
        }

- Save your new schema to a file named pattern_attribute.json.

- Validate your answer on Windows by running in the CMD shell:

        validate_m320 pattern_attribute --file pattern_attribute.json

- Validate your answer on MacOS and Linux by running:

        ./validate_m320 pattern_attribute --file pattern_attribute.json

After running this script you will either be given a validation code or an error message indicating what might be missing in your file.

When you get the validation code, paste it in the text box below and click the submit button.

***Enter answer here:***

    02008affbe09bedd4f196f19
    
***See detailed answer***

To solve this problem, you had to use the Attribute Pattern

Start by replacing the fields under the event field with k and v, where k will contain the name of an event as string and v will contain the date for such event.

Also, you needed to remove acquisition_date from the root of the document and use k/v to represent it.

The document listed in the question would look like the following once transformed:

    {
      "_id": ObjectId("5c5348f5be09bedd4f196f18"),
      "title": "Cookies in the sky",
      "artist": "Michelle Vinci",
      "location": "Blue Room, 20A",
      "on_display": false,
      "in_house": false,
      "events": [{
        "k": "date_acquisition",
        "v": ISODate("2017-12-25T00:00:00.000Z")
      }, {
        "k": "moma",
        "v": ISODate("2019-01-31T00:00:00.000Z")
      }, {
        "k": "louvres",
        "v": ISODate("2020-01-01T00:00:00.000Z")
      }]
    }

And the corresponding schema that you verified with the validator would look like this:

    {
      "_id": "<objectId>",
      "title": "<string>",
      "artist": "<string>",
      "location": "<string>",
      "on_display": "<bool>",
      "in_house": "<bool>",
      "events": [{
        "k": "<string>",
        "v": "<date>"
      }]
    }
    
## 3.4 Extended Reference Pattern

### Quiz

Which one of the following scenarios is the best candidate to use the Extended Reference Pattern to avoid doing additional reads through joins/lookups?

- [x] An app needs to retrieve a product and information about its supplier.
- [ ] An app needs to retrieve a product and its ten most recent reviews.
- [ ] A product model needs to store references to images of the product that are kept in an external location outside the database.
- [ ] A product model needs to store a counter representing the number of times it was purchased.
- [ ] An order model needs to store the product ID, the price sold, and the quantity ordered for each product in an order.

***See detailed answer***

___Correct Option:___

- An app needs to retrieve a product and information about its supplier.

This is a good scenario for the Extended Reference Pattern. It is likely that we want to carry some information about a supplier with the product, however not all of it. Having fields like the supplier's name, a reference number, and the supplier's phone number should provide all the information we need when looking at a product. Additional information like the complete address and billing contact should be left within the suppliers collection.

___Incorrect Options:___

- An app needs to retrieve a product and its ten most recent reviews.

This is a better scenario for the Subset Pattern. We want to bring in only the top ten reviews. However, a product may have a lot more reviews and these would be kept in a reviews collection.

- A product model needs to store a counter representing the number of times it was purchased.

This is a better scenario for the Computed Pattern. We would periodically calculate the number of times a product was purchased and store the information within the product itself.

- A product model needs to store references to images of the product that are kept in an external location outside the database.

This is one design solution to store large binaries. In this solution, the data is stored outside the database instead of inside it. However, this is not the definition of the Extended Reference Pattern.

- An order model needs to store the product ID, the price sold, and the quantity ordered for each product in an order.

The price sold and the quantity ordered are qualifying the relationship between the order and the products in it. The only other field, product ID, looks like a simple reference. If we want more information like the product name and a short description to also be part of the order document, then we should use the Extended Reference Pattern.

## 3.5 Subset Pattern

### Quiz

Which one of the following scenarios is the best candidate for use of the Subset Pattern?

- [ ] The system is running out of RAM.
- [x] The working set does not fit in memory and it is difficult to scale the hardware.
- [ ] The documents are too big.
- [ ] The developers of the system have left and no one understands the application.
- [ ] The system is accessing the disk too frequently

***See detailed answer***

___Correct Option:___

- The working set does not fit in memory and it is difficult to scale the hardware.

___Incorrect Options:___

- The system is running out of RAM.

Running out of RAM is likely not enough of a reason to change your schema. There could be other applications running on the system or some queries doing collection scans. The action should be to find the root cause of this issue first.

- The documents are too big.

The database can have large documents and operate perfectly, so long as there are not too many of them, or they are not used very often. The problem arises when there are many large documents, and they are part of the working set.

- The developers of the system have left and no one understands the application.

This means that doing any kind of maintenance is likely expensive. Doing a schema change that requires adding new collections and moving fields around may not be the right thing to do at this time. In this situation, you may want use money to solve the problem by using sharding to scale, if possible.

- The system is accessing the disk too frequently.

This may be an indication that your working set does not fit in memory. However, there could be other causes, like doing unneccessary collection scans or having poor indexes. The action should be to find the root cause of this issue first.

## Lab: Apply the Subset Pattern

### Problem

You are the lead developer for an online organic recycled clothing store. Consider the following user story:

___User Story___

Due to the growing number of environmentally-conscious consumers, our store's inventory has increased exponentially. We now also have an increasingly large pool of makers and suppliers.

We recently found that our shopping app is getting slower due to the fact that the frequently-used documents can no longer all fit in RAM. This is happening largely due to having all product reviews, questions, and specs stored in the same document, which grows in size as reviews and ratings keep coming in.

To resolve this issue, we want to reduce the amount of data immediately available to the user in the app and only load additional data when the user asks for it.

Currently a typical document in our data base looks like this:

    {
      "_id": ObjectId("5c9be463f752ec6b191c3c7e"),
      "item_code": "AS45OPD",
      "name": "Recycled Kicks",
      "maker_brand": "Shoes From The Gutter",
      "price": 100.00,
      "description": "These amazing Kicks are made from recycled plastics and
      fabrics.They come in a variety of sizes and are completely unisex in design.
      If your feet don't like them within the first 30 days, we'll return your
      money no questions asked.
      ",
      "materials": [
        "recycled cotton",
        "recycled plastic",
        "recycled food waste",
      ],
      "country": "Russia",
      "image": "https:///www.shoesfromthegutter.com/kicks/AS45OPD.img",
      "available_sizes": {
          "mens": ["5", "6", "8", "8W", "10", "10W", "11", "11W", "12", "12W"],
          "womens": ["5", "6", "7", "8", "9", "10", "11", "12"]
      },
      "package_weight_kg": 2.00,
      "average_rating": 4.8,
      "reviews": [{
          "author": "i_love_kicks",
          "text": "best shoes ever! comfortable, awesome colors and design!",
          "rating": 5
        },
        {
          "author": "i_know_everything",
          "text": "These shoes are no good because I ordered the wrong size.",
          "rating": 1
        },
        "..."
      ],
      "questions": [{
          "author": "i_love_kicks",
          "text": "Do you guys make baby shoes?",
          "likes": 1223
        },
        {
          "author": "i_know_everything",
          "text": "Why do you make shoes out of garbage?",
          "likes": 0
        },
        "..."
      ],
      "stock_amount": 10000,
      "maker_address": {
        "building_number": 7,
        "street_name": "Turku",
        "city": "Saint-Petersburg",
        "country": "RU",
        "postal_code": 172091
      },
      "makers": ["Ilya Muromets", "Alyosha Popovich", "Ivan Grozniy", "Chelovek Molekula"],
    }

---

___Task___

To address this user story, you must modify the following schema so that the working set can fit in RAM:

    {
      "_id": "<objectId>",
      "item_code": "<string>",
      "name": "<string>",
      "maker_brand": "<string>",
      "price": "<decimal>",
      "description": "<string>",
      "materials": ["<string>"],
      "country": "<string>",
      "image": "<string>",
      "available_sizes": {
        "mens": ["<string>"],
        "womens": ["<string>"]
      },
      "package_weight_kg": "<decimal>",
      "average_rating": "<decimal>",
      "reviews": [{
        "author": "<string>",
        "text": "<string>",
        "rating": "<int>"
      }],
      "questions": [{
        "author": "<string>",
        "text": "<string>",
        "likes": "<int>"
      }],
      "stock_amount": "<int>",
      "maker_address": {
        "building_number": "<string>",
        "street_name": "<string>",
        "city": "<string>",
        "country": "<string>",
        "postal_code": "<string>"
      },
      "makers": ["<string>"]
    }
    
You should accomplish this task by completing the following steps:

- Remove the the maker address and the list of makers from the schema with the intention of moving those pieces of information to a separate collection.

- Replace the reviews and questions fields with top_five_reviews and top_five_questions respectively.


***Enter answer here:***

    5c9c02e1f752ec6b191c3c7f
    
***See detailed answer***

To solve this problem, you had to use the Subset Pattern

Start by removing the unnecessary fields, such as makers and maker address. These fields are irrelevant for our users and the app.

We want to keep the rest of the fields renaming reviews to top 5 reviews and questions to top 5 questions to minimize the amount of data stored in a single document.

The document listed in the question would look like the following once transformed:

    {
      "_id": ObjectId("5c9be463f752ec6b191c3c7e"),
      "item_code": "AS45OPD",
      "name": "Recycled Kicks",
      "maker_brand": "Shoes From The Gutter",
      "price": 100.00,
      "description": "These amazing Kicks are made from recycled plastics and
      fabrics.They come in a variety of sizes and are completely unisex in design.
      If your feet don't like them within the first 30 days, we'll return your
      money no questions asked.
      ",
      "materials": [
        "recycled cotton",
        "recycled plastic",
        "recycled food waste",
      ],
      "country": "Russia",
      "image": "https:///www.shoesfromthegutter.com/kicks/AS45OPD.img",
      "available_sizes": {
          "mens": ["5", "6", "8", "8W", "10", "10W", "11", "11W", "12", "12W"],
          "womens": ["5", "6", "7", "8", "9", "10", "11", "12"]
      },
      "package_weight_kg": 2.00,
      "average_rating": 4.8,
      "top_five_reviews": [{
          "author": "i_love_kicks",
          "text": "best shoes ever! comfortable, awesome colors and design!",
          "rating": 5
        },
        {
          "author": "i_know_everything",
          "text": "These shoes are no good because I ordered the wrong size.",
          "rating": 1
        },
        "..."
      ],
      "top_five_questions": [{
          "author": "i_love_kicks",
          "text": "Do you guys make baby shoes?",
          "likes": 1223
        },
        {
          "author": "i_want_to_know_everything",
          "text": "How are these shoes made?",
          "likes": 1120
        },
        "..."
      ],
      "stock_amount": 10000,
    }
    
And the corresponding schema that you verified with the validator would look like this:

    {
      "_id": "<objectId>",
      "item_code": "<string>",
      "name": "<string>",
      "maker_brand": "<string>",
      "price": "<decimal>",
      "description": "<string>",
      "materials": ["<string>"],
      "country": "<string>",
      "image": "<string>",
      "available_sizes": {
        "mens": ["<string>"],
        "womens": ["<string>"]
      },
      "package_weight_kg": "<decimal>",
      "average_rating": "<decimal>",
      "top_five_reviews": [{
        "author": "<string>",
        "text": "<string>",
        "rating": "<int>"
      }],
      "top_five_questions": [{
        "author": "<string>",
        "text": "<string>",
        "likes":"<int>"
      }],
      "stock_amount": "<int>"
    }

