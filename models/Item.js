const mongoose = require('mongoose');
const categories = require('./config/categories.json');
// @TODO add routes for categories for the admins

const ItemSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: categories
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'company'
    },
    points: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    images: [String] //@TODO add limit to images
    // @TODO add item main image or something
});

module.exports = mongoose.model('item', ItemSchema);