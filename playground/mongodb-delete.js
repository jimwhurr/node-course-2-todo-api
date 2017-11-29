//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://192.168.0.126:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server.');
    }
    console.log('Connected to MongoDB server.');

    // deleteMany
    /*
    db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
        console.log(result);
    });
    */

    // deleteOne
    /*
    db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
        console.log(result);
    });
    */

    // findOneAndDelete
    /*
    db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log(result);
    });
    */

    // CHALLENGE:
    // Remove all
    // Delete another document (any one), delete by Id (findAndDelete)

    db.collection('Users').deleteMany({name: 'Fred'}).then((result) => {
        console.log(result.result);
    });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a1ebadfe4e371e2814195b6')
    }).then((result) => {
        console.log(result.result);
    });

    //db.close();
} );