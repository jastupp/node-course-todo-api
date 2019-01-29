const _ = require('lodash');
const express = require('express');
const parser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

require('./config/config');
const mongoose = require('./db/mongoose').mongoose;
const Todo = require('./models/todo').Todo;
const User = require('./models/user').User;

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

        Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
            .then((result) => {
                result || response.sendStatus(404);
                result && response.send({todo: result});
            }).catch((error) => response.sendStatus(400));
    }


});



app.listen(port, () => {
    console.log(`Started listening on ${port}.. `);
});

module.exports = {
    app: app
};





