const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}) -- remove all, only returns number of docs removed

//Todo.findOneAndRemove({}); -- removes a doc,, returns the deleted doc

// Todo.findByIdAndRemove(id) -- as per findOneAndRemove

Todo.findByIdAndRemove('5a1f822ee30dc8b0c44663be').then( (todo) => {
    console.log(todo);
});