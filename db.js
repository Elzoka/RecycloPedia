const mongoose = require('mongoose');
const {MONGODB_URI} = require('./config');

if(MONGODB_URI !== 'test'){
    mongoose.connect(MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true
    });
}