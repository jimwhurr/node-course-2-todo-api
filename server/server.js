const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

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
        res.send( { todos } );                  // as object - can add properties later
    }, (e) => {
        // error case
        res.status(400).send(e);
    });

});

app.listen(3000, () => {
    console.log('Server started on port 3000, ctrl-C to exit');
});

module.exports = { app };                     // ES 6 notation for { app: app }