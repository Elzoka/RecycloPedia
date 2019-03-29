const mongoose = require('mongoose');
const validator = require('validator');
const categories = require('./config/categories.json');
// @TODO add routes for categories for the admins

const ItemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        validate: {
            validator: val => categories.includes(val),
            message: 'category field is invalid'
        }
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'company',
        validate: {
            validator: val => validator.isMongoId(val.toString()),
            message: 'invalid company id'
        }
    },
    points: {
        type: Number,
        required: true,
        min: [0, 'points must be greater than zero']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: true,
        maxlength: 30
    },
    description: {
        type: String,
        maxlength: 200
    },
    images: {
        type: [String],
        maxlength: 4
    }
    // @TODO add item main image or something
});

module.exports = mongoose.model('item', ItemSchema);