const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const todo_id1 = '4c4ead502d8729705d9a4ccc';
const todo_id2 = '4c4ead502d8729705d9a4ccd';
const user_id1 = '4c4ead502d8729705d9a4cce';
const user_id2 = '4c4ead502d8729705d9a4ccf';

const test_todos = [{_id: todo_id1, text: 'First test todo'},
                    {_id: todo_id2, text: 'Second test todo'}];

const test_users = [
    {_id: user_id1,
     email: 'me@here.com',
     password: 'UserOnePass',
     tokens: [{access: 'auth', token: jwt.sign({_id: user_id1, access: 'auth'}, '12345').toString()}]},
    {_id: user_id2,
     email: 'me@there.com',
     password: 'UserTwoPass'}];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(test_todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const one = new User(test_users[0]).save();
        const two = new User(test_users[1]).save();

        return Promise.all([one, two]);
    }).then(() => done());
};

module.exports = {
    test_todos: test_todos,
    populateTodos: populateTodos,
    test_users: test_users,
    populateUsers: populateUsers
};

