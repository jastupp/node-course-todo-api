const assert = require('expect');
const test = require('supertest');

const app  = require('../server').app;
const Todo  = require('../models/todo').Todo;

const test_data = [{text: 'First test todo'},
                   {text: 'Second test todo'}];

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

describe('GET /todos', (done) => {
    it('Should return the test todos', () => {
        test(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                assert(response.body.length).toBe(2);
            })
            .end(done);
    }); 
});

