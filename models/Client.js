const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const config = require('../config');
const AddressSchema = require('./shema/AddressSchema');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 25
    },
    address: [AddressSchema],
    points: { // @TODO add transaction incoming & outgoing
        type: Number,
        default: 0,
        min: [0, 'invalid operation']
    },
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request',
        validate: {
            validator: val => validator.isMongoId(val.toString()), // shouldn't use this validator but just in case
            message: 'invalid id'
        }
    }],
    phone: {
        type: String,
        required: true,
        validate: {
            validator: value => validator.isMobilePhone(value, 'ar-EG'),
            message: 'invalid phone number'
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'email field is invalid'
        }
    },
    password: {
        type: String,
        required: true
    },
    rating: {
        type: Number, // @TODO calculate rating from requests 
        default: -1 // No rating
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    pic: {
        type: String,
        default: "/client/12" // default it to random logo
    }
});


// hash the password before saving
ClientSchema.pre('save', function (next) {
    if(this.isModified('password')){
        // hash the password
        bcrypt.genSalt(10, (err, salt) => {
            if(err){
                return next(err);
            }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if(err){
                    return next(err);
                }
                this.password = hash;
                next();
            })
        });
    }else{
        next();
    }
});

ClientSchema.methods.generateAuthToken = function() {
    return new Promise((resolve, reject) => {
        // sign the token
        // @TODO sign other useful data
        jwt.sign({id: this._id, user: 'client'}, config.JWT_CLIENT_SECRET, (err, token) => {
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        });
    });

};

module.exports = mongoose.model('client', ClientSchema);