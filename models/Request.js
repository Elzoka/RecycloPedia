const mongoose = require('mongoose');
const validator = require('validator');

const statusValues = ['sent', 'approved', 'assigned', 'fullfilled'];
const RequestSchema = new mongoose.Schema({
    items: {
        type:[{
            id:{
                type: mongoose.Schema.ObjectId,
                ref: 'item',
                validate: {
                    validator: val => validator.isMongoId(val.toString()),
                    message: 'invalid item id'
                }
            },
            points: {
                type: Number,
                min: [0, 'invalid operation']
            },
            quantity: {
                type: Number,
                min: [1, 'quantity shouldn\'t be less than 1']
            },
            _id: false
        }],
        minlength: 1,
        maxlength: 10 // @TODO could change it later
    },
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'client',
        required: true,
        validate: {
            validator: val => validator.isMongoId(val.toString()),
            message: 'invalid client id'
        }
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'company',
        required: true,
        validate: {
            validator: val => validator.isMongoId(val.toString()),
            message: 'invalid company id'
        }
    },
    representative: {
        type: mongoose.Schema.ObjectId,
        ref: 'representative',
        default: null,
        validate: {
            validator: val => {
                // to pass the default
                if (val === null){
                    return true;
                }
                return validator.isMongoId(val.toString())
            },
            message: 'invalid representative id'
        }
    },
    status: {
        type: String,
        // enum: ['sent', 'approved', 'assigned', 'fullfilled'], // on going, fullfilled, etc
        trim: true,
        lowercase: true,
        default: 'sent',
        validate: {
            validator: val => statusValues.includes(val),
            message: 'invalid status'
        }
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
        default: 0,
        min: [0, 'invalid operation']
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