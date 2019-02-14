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
        ref: 'request'
    },
    points: {
        type: Number,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    description: String,
    images: [String]
});

module.exports = mongoose.model('plan', PlanSchema);