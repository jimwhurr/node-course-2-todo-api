const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//const id = "5a1fe5f97f26f46b78a41ea611";      // original: 5a1fe5f97f26f46b78a41ea6
//
// if ( ! ObjectID.isValid(id) ) {
//     console.log('Id not valid');
// }
//
// mongoose will coerce string to an id, don't have to create one
// Todo.find( { _id: id } ).then( (todos) => {
//     console.log('Todos ', todos);
// });

// // findOne returns a single doc rather than an array ^^^^
// Todo.findOne( { _id: id } ).then( (todo) => {
//     console.log('Todo ', todo);    
// });
//
// only needs the id string
// Todo.findById(id).then( (todo) => {
//     // catch id not found
//     if ( ! todo ) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id ', todo);    
// }).catch( (e) => console.log(e) );

// CHALLENGE:
// Query Users collection using User.findById, then handle
//  1. query works but no user
//  2. query ok
//  3. catch any other errors
const uid = "5a1f1a8ce30dc8b0c4464bf8";

User.findById(uid).then( (user) => {
    if ( ! user ) {
        return console.log('User id not found')
    }

    console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
    console.log(e);
});
