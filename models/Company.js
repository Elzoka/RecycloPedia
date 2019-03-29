const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const config = require('../config');
const AddressSchema = require('./shema/AddressSchema');

// @TODO add a feature that let a company create a poll to create a new category
// and let other companies vote

const CompanySchema = new mongoose.Schema({ // @TODO add transaction => incoming out going
    name: {
        type: String,
        required: true,
        maxlength: 30
    },
    address: [AddressSchema],
    points: { // @TODO check if the availabe point are enough for each assigned request
        type: Number,
        default: 0,
        min: [0, 'invalid operation']
    },
    serviceAvailableIn: [{ // @TODO add REST routes when more info available
        type: String
    }],
    contactInfo: {
        email: [{ // workEmail
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: validator.isEmail,
                message: 'email field is invalid'
            }
        }],
        phone: [{
            type: String,
            trim: true,
            validate: {
                validator: val => validator.isMobilePhone(val, 'ar-EG'),
                message: 'phone field is invalid'
            }
        }],
        fax: [{
            type: String,
            trim: true // @TODO add validation or maybe delete this field
        }]
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
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: { // @TODO calculate rating from requests
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