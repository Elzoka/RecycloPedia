const mongoose = require('mongoose');
const categories = require('./config/categories.json');


const PlanSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: categories
    },
    points: {
        type: Number,
        required: true
    },
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    itemName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    description: String
});

module.exports = mongoose.model('plan', PlanSchema);