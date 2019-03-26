const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    plan: {
        type: mongoose.Schema.ObjectId,
        // required: true
        default: null
    },
    items: { // @TODO replace plan collection with items collection
        type:[String],
        minlength: 1,
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
        ref: 'representative',
        default: null
    },
    status: {
        type: String,
        enum: ['sent', 'approved', 'assigned', 'fullfilled'], // on going, fullfilled, etc
        trim: true,
        lowercase: true,
        default: 'sent'
    }, // @TODO add the expected collection date
    createdAt: {
        type: Date,
        default: new Date()
    },
    fullfilledAt: {
        type: Date,
        default: null
    },
    points: { // @TODO auto calculate points from items
        type: Number,
        default: 0
    }

    // @TODO add rating for each the company and the client
});

module.exports = mongoose.model('request', RequestSchema);