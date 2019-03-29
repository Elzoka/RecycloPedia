const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const config = require('../config');

const RepresentativeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
    },
    requests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'request',
        validate: {
            validator: val => validator.isMongoId(val.toString()),
            message: 'invalid request id'
        }
    }],
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'company',
        required: true,
        validate: {
            validator: val => validator.isMongoId(val.toString()),
            message: 'invalid company id'
        }
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        maxlength: 30,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    pic: {
        type: String,
        default: "/rep/12" // default it to random logo
    }
});


// hash the password before saving
RepresentativeSchema.pre('save', function (next) {
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

RepresentativeSchema.methods.generateAuthToken = function() {
    return new Promise((resolve, reject) => {
        // sign the token
        // @TODO sign other useful data
        jwt.sign({id: this._id, user: 'rep', company: this.company}, config.JWT_REP_SECRET, (err, token) => {
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        });
    });

};

module.exports = mongoose.model('representative', RepresentativeSchema);