const mongoose = require('mongoose');

const RepresentativeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    representatives: [{
        type: mongoose.Schema.ObjectId,
        ref: 'rep'
    }],
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    contactInfo: {
        
    },
    username: {
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
    },
    pic: {
        type: String,
        default: "/rep/12" // default it to random logo
    }
});


module.exports = mongoose.model('representative', RepresentativeSchema);