const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const AddressSchema = require('./shema/AddressSchema');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30
    },
    address: AddressSchema,
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
    serviceAvailableIn: [{
        type: String
    }],
    plans: [{
        type: mongoose.Schema.ObjectId,
        ref: 'plan'
    }],
    contactInfo: {
        email: { // workEmail
            type: String,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true,
            required: true
        },
        fax: {
            type: String,
            trim: true,
        }
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        default: -1 // No rating
    },
    logo: {
        type: String,
        default: "12" // default it to random logo
    }
});

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

CompanySchema.methods.generateAuthToken = (agent) => {
    return new Promise((resolve, reject) => {
        // sign the token
        jwt.sign({_id: this._id, agent}, config.JWT_SECRET, (err, token) => {
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        });
    });

};

module.exports = mongoose.model('company', CompanySchema);