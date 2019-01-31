const express = require('express');
const mongoose = require('mongoose');

const app = express();

const config = require('./config');

mongoose.connect(config.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
});

// Routes
const routes = require('./routes');
app.use('/', routes);

app.listen(config.PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `The server is up on port ${config.PORT}`);
});