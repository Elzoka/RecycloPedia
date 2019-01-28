const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    plan: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    numberOfItems: {
        type: Number,
        default: 1
    },
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
        enum: ['sent', 'approved', 'assigned', 'fullfilled'], // on going, fullfilled, etc
        trim: true,
        lowercase: true,
        default: 'sent'
    },
    createdAt: {
        type: Date,
        required: true
    },
    fullfilledAt: {
        type: Date,
        default: null
    },
    points: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('request', RequestSchema)