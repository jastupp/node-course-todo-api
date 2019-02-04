const _ = require('lodash');
const express = require('express');
const parser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');


require('./config/config');
const mongoose = require('./db/mongoose').mongoose;
const Todo = require('./models/todo').Todo;
const User = require('./models/user').User;
const {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(parser.json());
const port = process.env.PORT;


app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then((result) => {
        response.send(result);
    }, (error) => {
        response.status(400).send(error);
    });
});


app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({todos: todos});
    }, (error) => {
        response.send(400).send(error);
    })
});


app.get('/todos/:id', (request, response) => {
    const id = request.params.id;

    if(!ObjectID.isValid(id)) {
        response.status(404).send('Check id is valid');
    } else {
        Todo.findById(id).then((result) => {
            result && response.send({todo: result});
            result || response.sendStatus(404);
        }, (error) => {
            response.sendStatus(400);
        });
    }
});


app.delete('/todos/:id', (request, response) => {
    const id = request.params.id;

    if(!ObjectID.isValid(id)) {
        response.status(404).send();
    } else {
        Todo.findByIdAndDelete(id).then((result) => {
            result && response.send({todo: result});
            result || response.sendStatus(404);
        }, (error) => {
            response.sendStatus(400);
        });
    }
});


app.patch('/todos/:id', (request, response) => {
    const id = request.params.id;

    var body = _.pick(request.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)) {
        response.sendStatus(404);
    } else {

        if(_.isBoolean(body.completed)) {
            body.completedAt = (body.completed) ? new Date().getTime() : null;
        } else {
            body.completed = false;
        }

        Todo.findOneAndUpdate(id, {$set: body}, {new: true})
            .then((result) => {
                result || response.sendStatus(404);
                result && response.send({todo: result});
            }).catch((error) => response.sendStatus(400));
    }
});


app.post('/users', (request, response) => {
   const user_items = _.pick(request.body, ['email', 'password']);
   const user = new User(user_items);

   user.save().then(() => {
       return user.generateAuthToken();
   }).then((token) => {
       response.header('x-auth', token).send(user);
   }).catch((error) => {
       response.status(400).send(error);
   });
});


app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});


app.post('/users/login', (request, response) => {

   const user_items = _.pick(request.body, ['email', 'password']);

   User.findByCredentials(user_items.email, user_items.password).then((user) => {
       user.generateAuthToken().then((token) => {
            response.header('x-auth', token).send(user);
       });
   }).catch((erorr) => {
       response.sendStatus(400);
   });
});


app.listen(port, () => {
    console.log(`Started listening on ${port}.. `);
});


module.exports = {
    app: app
};





