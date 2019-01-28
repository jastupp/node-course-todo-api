const ObjectID = require('mongodb').ObjectID;

const mongoose = require('../server/db/mongoose').mongoose;
const Todo = require('../server/models/todo').Todo;
const User = require('../server/models/user').User;

//const id = '5c4ead502d8729705d9a4ccc';
const id = '5c4e4fc25f571b6af86f2d9c';

// Todo.find({
//     _id: id
// }).then((result) => {
//     console.log('Found ..', result);
// });
//
//
// Todo.findOne({
//     _id: id
// }).then((result) => {
//     console.log('Found ..', result);
// });

// Todo.findById(id).then((result) => {
//     result || console.log("Id not found");
//     result && console.log('Found by id ..', result);
// }).catch((error) => { console.log(error); });

User.findById(id).then((result) => {
    result || console.log("Id not found");
    result && console.log('Found by id ..', result);
}).catch((error) => { console.log(error); });



