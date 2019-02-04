const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim:true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: { type: String, required: true, minlength: 6 },
    tokens: [{ access: { type: String, required: true },
               token: { type: String, required: true }}]
});

schema.methods.toJSON = function()  {
    const user = this;
    const user_object = user.toObject();

    return _.pick(user_object, ['_id', 'email']);
};

schema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access: access}, '12345').toString();

    user.tokens.push({access: access, token: token});

    return user.save().then(() => token);
};

schema.statics.findByToken = function(token) {
    var user = this;
    var decoded;

    try {
        decoded = jwt.verify(token, '12345');
    } catch(error) {
        return Promise.reject();
    }

    return user.findOne({
       '_id': decoded._id,
       'tokens.token': token,
       'tokens.access': 'auth'
    });
};

schema.statics.findByCredentials = function(email, password) {

    const user = this;

    return user.findOne({email: email}).then((user) => {
        if(!user) { return Promise.reject(); }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, result) => {
                console.log(error, result);
                if(error || !result) {
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        })
    })
};

schema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', schema);

module.exports = {
    User: User
};