
const User = require('../models/user').User;



var authenticate = (request, repsponse, next) => {
    var token = request.header('x-auth');
    User.findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject();
        } else {
            request.user = user;
            request.token = token;
            next();
        }
    }, (error) => {
        //response.sendStatus(401);
        console.log('REJECTED !!');
        console.log(error);
    }).catch((error) => {
        response.sendStatus(401);
    });
};


module.exports = {
    authenticate: authenticate
};