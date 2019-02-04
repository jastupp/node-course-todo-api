const assert = require('expect');
const jwt = require('jsonwebtoken');
const test = require('supertest');

//const ObjectID = require('mongodb').ObjectID;

const app  = require('../server').app;
const Todo  = require('../models/todo').Todo;
const {test_todos, populateTodos, test_users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        test(app).
            post('/todos').
            send({text: text}).
            expect(200).
            expect((response) => {
                assert(response.body.text).toEqual(text);
            }).
            end((error, resopnse) => {
                if(error) {
                    done(error);
                } else {
                    Todo.find({text: text}).then((todos) => {
                        assert(todos.length).toBe(1);
                        done();
                    }).catch((error) => done(error));
                }
            });
    });

    it('should not create todo woth invalid data', (done) => {
        test(app).
            post('/todos').
            send({text: ' '}).
            expect(400).
            end((error, resopnse) => {
                if(error) {
                    done(error);
                } else {
                    Todo.find().then((todos) => {
                    assert(todos.length).toBe(2);
                    done();
                }).catch((error) => done(error));
            }
        });
    })
});

describe('GET /todos', () => {
    it('Should return the test todos', (done) => {
        test(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                assert(response.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos:id', () => {

    const todo = test_todos[0];

    it('Should return a todo', (done) => {
        test(app)
            .get('/todos/' + todo._id)
            .expect(200)
            .expect((response) => {
                assert(response.body.todo._id).toBe(todo._id);
            })
            .end(done);
    });

    it('Should return a 404 as the id doest not exist', (done) => {
        test(app)
            .get('/todos/4c4ead502d8729705d9a4ccb')
            .expect(404)
            .end(done);
    });

    it('Sould return 404 with invalid id', (done) => {
        test(app)
            .get('/todos/' + todo._id + 'q')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos:id', () => {

    const todo = test_todos[0];

    it('Should remove a todo', (done) => {
        test(app)
            .delete('/todos/' + todo._id)
            .expect(200)
            .expect((response) => {
                assert(response.body.todo._id).toBe(todo._id);
            })
            .end((error, response) => {
                Todo.findById(todo._id).then((result) => {
                    assert(result).toBeNull();
                    done();
                }).catch((error) => done(error))
            });
    });

    it('Should return a 404 as the id doest not exist', (done) => {
        test(app)
            .delete('/todos/4c4ead502d8729705d9a4ccb')
            .expect(404)
            .end(done);
    });

    it('Sould return 404 with invalid id', (done) => {
        test(app)
            .delete('/todos/' + todo._id + 'q')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos:id', () => {

    const todo = test_todos[0];

    it('Should update a todo', (done) => {
        const text = 'Updated Text';
        test(app)
            .patch('/todos/' + todo._id)
            .send({text: text, completed: true})
            .expect(200)
            .expect((response) => {
                assert(response.body.todo._id).toBe(todo._id);
                assert(response.body.todo.text).toBe(text);
                assert(response.body.todo.completed).toBe(true);
                assert(response.body.todo.completedAt).toBeTruthy();
            })
            .end(done);
    });


    it('Should update a todo and set completed false', (done) => {
        const text = 'Updated Text';
        test(app)
            .patch('/todos/' + todo._id)
            .send({text: text + 'QQQ', completed: false})
            .expect(200)
            .expect((response) => {
                assert(response.body.todo._id).toBe(todo._id);
                assert(response.body.todo.text).toBe(text + 'QQQ');
                assert(response.body.todo.completed).toBe(false);
                assert(response.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {

    const user1 = test_users[0];

    it('Should return a user if authenticated', (done) => {
        test(app)
            .get('/users/me')
            .set('x-auth', user1.tokens[0].token)
            .expect(200)
            .expect((response) => {
                assert(response.body._id = user1._id);
                assert(response.body.email = user1.email);
            })
            .end(done);
    });
    //
    // it('Should return a 401 if not authenticated', (done) => {
    //     test(app)
    //         .get('/users/me')
    //         .expect(401)
    //         .expect((response) => {
    //             assert(response.body).toBe({});
    //         })
    //         .end(done);
    // });
});

describe('POST /users', () => {

    const user1 = test_users[0];

    it('Should create a user', (done) => {
        const email = 'test@there.com';
        const password = 'testPassword';

        test(app)
            .post('/users')
            .send({email: email, password: password})
            .expect(200)
            .expect((response) => {
               assert(response.headers['x-auth']).toBeDefined();
               assert(response.body._id).toBeDefined();
               assert(response.body.email).toBe(email);
            })
            .end(done);
    });

    it('Should return validation error', (done) => {

        test(app)
            .post('/users')
            .send({email: 'invalid', password: 'short'})
            .expect(400)
            .end(done);

    });

    it('Should not create user with duplicate email', (done) => {

        test(app)
            .post('/users')
            .send({email: user1.email, password: 'short'})
            .expect(400)
            .end(done);
    });

});


