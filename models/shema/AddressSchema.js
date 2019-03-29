const mongoose = require('mongoose');
const validator = require('validator');

const AddressSchema = new mongoose.Schema({
    country: { // @TODO add validation for available countries and cities
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    extra: { // @TODO rename it to a more descriptive name
        type: String,
        required: true,
    },
    coordinates: {
        type: {
            latitude: {
                type: mongoose.Decimal128,
                required: true,
            },
            longitude: {
                type: mongoose.Decimal128,
                required: true,
            }
        },
        validate: {
            validator: ({latitude, longitude}) => validator.isLatLong(`${latitude}, ${longitude}`),
            message: 'invalid coordinates'
        }
    }
});

module.exports = AddressSchema;