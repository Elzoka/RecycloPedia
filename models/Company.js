const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
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
    representatives: [{
        type: mongoose.Schema.ObjectId,
        ref: 'rep'
    }],
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    serviceAvailableIn: [{
        type: String
    }],
    plans: [{
        type: mongoose.Schema.ObjectId,
        ref: 'plan'
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
    },
    logo: {
        type: String,
        default: "12" // default it to random logo
    }
});


module.exports = mongoose.model('company', CompanySchema);