const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    items: {
        type:[{
            id:{
                type: mongoose.Schema.ObjectId,
                ref: 'item'
            },
            points: Number,
            quantity: Number,
            _id: false
        }],
        minlength: 1,
        maxlength: 10 // @TODO could change it later
    },
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'client',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'company',
        required: true
    },
    representative: {
        type: mongoose.Schema.ObjectId,
        ref: 'representative',
        default: null
    },
    status: {
        type: String,
        enum: ['sent', 'approved', 'assigned', 'fullfilled'], // on going, fullfilled, etc
        trim: true,
        lowercase: true,
        default: 'sent'
    }, // @TODO add the expected fullfillment date
    createdAt: {
        type: Date,
        default: new Date()
    },
    fullfilledAt: {
        type: Date,
        default: null
    },
    points: {
        type: Number,
        default: 0
    }

    // @TODO add rating for each the company and the client
});

// @TODO modify the reponse in POST routes to return a smarter response and less data (not the whole created object)

RequestSchema.pre('save', function (next) {
    if(!this.isModified('items')){
        return next();
    }
    this.points = this.items.reduce((total, item) => total + item.points * item.quantity, 0);
    next();
});


module.exports = mongoose.model('request', RequestSchema);