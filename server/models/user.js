const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

const User = mongoose.model('User', schema);

module.exports = {
    User: User
};