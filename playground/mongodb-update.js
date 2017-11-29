//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://192.168.0.126:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server.');
    }
    console.log('Connected to MongoDB server.');

    // findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a1eb616e4e371e281419481')
    // }, {
    //     // need to specify the update operator, see manual
    //     $set: { completed: true } 
    // }, {
    //     // et the option to specify what we get back
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });   

    // CHALLENGE

    // update name to another name & inc the age using $inc
    db.collection('Users').findOneAndUpdate({
        _id: 'jim.whurr@gmail.com'
    }, {
        $set: { name: 'James'},
        $inc: { age: 1}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result)
    });
    //db.close();
} );