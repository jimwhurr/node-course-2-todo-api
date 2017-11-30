const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://192.168.0.126:27017/TodoApp', {useMongoClient: true });

module.exports = { mongoose };      // ES equiv to { mongoose: mongoose }