const mongoose = require('mongoose');
const AddressSchema = require('./shema/AddressSchema');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: AddressSchema,
    points: {
        type: Number,
        default: 0
    },
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    phone: {
        type: String,
        required: true
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
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('client', ClientSchema);