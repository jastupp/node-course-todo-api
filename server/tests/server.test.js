const assert = require('expect');
const test = require('supertest');

const app  = require('../server').app;
const Todo  = require('../models/todo').Todo;

beforeEach((done) => {
   Todo.remove({}).then(() => done() );
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
                    Todo.find().then((todos) => {
                        assert(todos.length).toBe(1);
                        assert(todos[0].text).toBe(text);
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
                    assert(todos.length).toBe(0);
                    done();
                }).catch((error) => done(error));
            }
        });
    })
});

