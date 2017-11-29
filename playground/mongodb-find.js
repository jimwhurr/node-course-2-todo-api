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
    // the find() method returns a cursor, toArray() will return all recods
    // as an array as a promise, so can use .then()
    db.collection('Todos').find().toArray().then((docs) => {
        console.log('Todos:');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos ', err);
    });
    */
    // limit serach to only docs where completed is false...
    //db.collection('Todos').find({completed: false}).toArray().then((docs) => {

    /* find by _id property
    db.collection('Todos').find({
            _id: new ObjectID("5a1d8a832b05df444a5a27dc")
        }).toArray().then((docs) => {
    */

    /*
    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch todos ', err);
    });
    */

    db.collection('Users').find({name: 'Jim'}).toArray().then((docs) => {
        console.log('Users:');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch users ', err);        
    });


    db.close();
} );