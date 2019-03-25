const mongoose = require('mongoose');
const categories = require('./config/categories.json');
// @TODO add routes for categories for the admins

const PlanSchema = new mongoose.Schema({
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
    // @TODO create an item collection
    itemName: {
        type: String,
        required: true
    },
    description: String,
    images: [String]
});

module.exports = mongoose.model('plan', PlanSchema);