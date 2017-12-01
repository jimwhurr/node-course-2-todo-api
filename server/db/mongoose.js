const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true });

module.exports = { mongoose };      // ES equiv to { mongoose: mongoose }