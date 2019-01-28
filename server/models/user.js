const mongoose = require('mongoose');

var User = mongoose.model('user', {
    email: { type: String, required: true, minLength: 1, trim:true },
});

module.exports = {
    User: User
};