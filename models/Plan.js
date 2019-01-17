const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    category: String,
    points: {
        type: Number,
        required: true
    },
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    item: {
        // itemSchema
    },
    description: String
});

module.exports('plan', PlanSchema)