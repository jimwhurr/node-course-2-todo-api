//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//const obj = new ObjectID();                 // creates a new object id
//console.log(obj);

// Object Destructuring e.g....
//  const user = {name: 'jim', age: 61};    // an object with properties
//  const {name} = user;                    // creates a name const equal to user.name



MongoClient.connect('mongodb://192.168.0.126:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server.');
    }
    console.log('Connected to MongoDB server.');

   /*
    db.collection('Todos').insertOne({
        test: 'Go do some exercise',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo ', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    */

    // insert new doc into Users collection with name, age location properties

    /*
    db.collection('Users').insertOne({
        name: 'Ben Whurr',
        age: 11,
        location: 'Leeds'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user ', err);
        }

        console.log(result.ops[0]._id.getTimestamp());
        //console.log(JSON.stringify(result.ops, undefined, 2));
    });
    */

    db.close();
} );