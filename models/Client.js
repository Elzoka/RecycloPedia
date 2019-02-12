const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const AddressSchema = require('./shema/AddressSchema');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: [AddressSchema],
    // @TODO add a pic
    points: { // @TODO add transaction incoming & outgoing
        type: Number,
        default: 0
    },
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: -1 // No rating
    },
    createdAt: {
        type: Date,
        default: Date.now()
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