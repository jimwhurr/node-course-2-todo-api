require('./config/config');                     // configure environment

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then( (doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos', (req, res) => {
    // get all todos
    Todo.find().then( (todos) => {
        res.send( { todos } );                 // as object - can add properties later
    }, (e) => {
        // error case
        res.status(400).send(e);
    });
});


app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    // validate is
    if ( ! ObjectID.isValid(id) ) {
        return res.status(404).send();
    }
    
    Todo.findById(id).then( (todo) => {
        if ( ! todo ) {                         // ok but no record
            res.status(404).send();
        }
        else {
            res.send( { todo } );               // ok!
        }
    }, (e) => {
        res.status(400).send();                 // bad query
    });
});


app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    // validate id
    if ( ! ObjectID.isValid(id) ) {
        return res.status(404).send();
    }
    
    Todo.findByIdAndRemove(id).then( (todo) => {
        if ( ! todo ) {                         // ok but no record
            return res.status(404).send();
        }
        res.send( { todo } );               // ok!
    }, (e) => {
        res.status(400).send();                 // bad query
    });
});


app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;

    // user should only be able to change some fields, so PICK them...
    var body = _.pick(req.body, ['text', 'completed']);

    // validate id
    if ( ! ObjectID.isValid(id) ) {
        return res.status(404).send();
    }

    // if changing completed state then need to reflect in completedAt
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date.now();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    // now query/update ({new: true} requests return of the updated doc)
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (todo) => {
        if ( ! todo ) {
            return res.status(404).send();
        }

        res.send( {todo} );
    }).catch( (e) => {
        res.status(400).send();
    });
});


// POST /users
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    const user = new User(body);

    user.save().then( () => {
        return user.generateAuthToken();        // returns the promise setup in model
    }).then( (token) => {
        res.header('x-auth', token).send(user); // token also pushed to tokens array
    }).catch( (e) => {
        console.log('error:', e);
        res.status(400).send(e);        
    });
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}, ctrl-C to exit`);
});

module.exports = { app };                     // ES 6 notation for { app: app }