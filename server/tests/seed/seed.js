const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'user1@test.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'user2@test.com',
    password: 'userTwoPass'
}];

const testTodos = [
    {
        _id:  new ObjectID(),                           // _id added to support query tests
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt:333
    }
];

const populateTodos =  (done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(testTodos);
    }).then( () => done() );
};

const populateUsers =  (done) => {
    User.remove({}).then( () => {
        // have to run users through middleware so can't call insertMany
        const userOne = new User(users[0]).save();      // userOne will be a Promise
        const userTwo = new User(users[1]).save();

        // now wait for all promises to resolve, return promise for a .then 
        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {testTodos, populateTodos, users, populateUsers};