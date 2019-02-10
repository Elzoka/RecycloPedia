const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const AddressSchema = require('./shema/AddressSchema');

const CompanySchema = new mongoose.Schema({ // @TODO add transaction => incoming out going
    name: {
        type: String,
        required: true,
        maxlength: 30
    },
    address: [AddressSchema],
    points: {
        type: Number,
        default: 0
    },
    representatives: [{
        type: mongoose.Schema.ObjectId,
        ref: 'rep'
    }],
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request'
    }],
    serviceAvailableIn: [{ // @TODO add REST routes when more info available
        type: String
    }],
    plans: [{
        type: mongoose.Schema.ObjectId,
        ref: 'plan'
    }],
    contactInfo: {
        email: [{ // workEmail
            type: String,
            trim: true,
            lowercase: true,
        }],
        phone: [{
            type: String,
            trim: true,
        }],
        fax: [{
            type: String,
            trim: true,
        }]
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
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: { // @TODO change it to array of objects
        type: Number,
        default: -1 // No rating
    }, // @TODO add feedback
    logo: {
        type: String,
        default: "12" // default it to random logo
    }
    // @TODO add payment history
});

// hash the password before saving
CompanySchema.pre('save', function (next) {
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

CompanySchema.methods.generateAuthToken = function() {
    return new Promise((resolve, reject) => {
        // sign the token
        // @TODO sign other useful data
        jwt.sign({id: this._id, user: 'company'}, config.JWT_COMPANY_SECRET, (err, token) => {
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        });
    });

};

module.exports = mongoose.model('company', CompanySchema);