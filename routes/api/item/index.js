const item = require('express').Router();

const itemRoutes = require('./itemRoutes');

// /api/item
item.use('/', itemRoutes);

module.exports = item;