const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    country: { // @TODO add validation for available countries and cities
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    extra: { // @TODO rename it description
        type: String,
        required: true
    },
    coordinates: {
        latitude: {
            type: mongoose.Decimal128,
            required: true
        },
        longitude: {
            type: mongoose.Decimal128,
            required: true
        }
    }
});

module.exports = AddressSchema;