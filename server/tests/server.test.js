const assert = require('expect');
const test = require('supertest');
const ObjectID = require('mongodb').ObjectID;

const app  = require('../server').app;
const Todo  = require('../models/todo').Todo;

const id1 = '4c4ead502d8729705d9a4ccc';
const id2 = '4c4ead502d8729705d9a4ccd';

const test_data = [{_id: id1, text: 'First test todo'},
                   {_id: id2, text: 'Second test todo'}];

beforeEach((done) => {
   Todo.deleteMany({}).then(() => {
       return Todo.insertMany(test_data);
   }).then(() => done());
});

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
    it('Should return a todo', (done) => {
        test(app)
            .get('/todos/' + id1)
            .expect(200)
            .expect((response) => {
                //console.log('QQQQ', response.body.todo._id);
                assert(response.body.todo._id).toBe(id1);
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
            .get('/todos/' + id1 + 'q')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos:id', () => {
    it('Should remove a todo', (done) => {
        test(app)
            .delete('/todos/' + id1)
            .expect(200)
            .expect((response) => {
                //console.log('QQQQ', response.body.todo._id);
                assert(response.body.todo._id).toBe(id1);
            })
            .end((error, response) => {
                Todo.findById(id1).then((result) => {
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
            .delete('/todos/' + id1 + 'q')
            .expect(404)
            .end(done);
    });
});

