const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    address: {

    },
    points: {
        type: Number,
        default: 0
    },
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    contactInfo: {
        
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: -1 // No rating
    }
});


module.exports = mongoose.model('client', ClientSchema);