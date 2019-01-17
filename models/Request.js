const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    item: {
        // itemSchema
    },
    numberOfItems: Number,
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'client',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'company',
        required: true
    },
    representative: {
        type: mongoose.Schema.ObjectId,
        ref: 'rep',
        required: true
    },
    status: {
        type: String,
        enum: [] // on going, fullfilled, etc
    },
    fullfilledAt: Date,
    points: Number
});

module.exports('request', RequestSchema)