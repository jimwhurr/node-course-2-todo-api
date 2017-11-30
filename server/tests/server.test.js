const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach( (done) => {
    Todo.remove({}).then( () => done() );
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})                               // ** ES6 notation
            .expect(200)
            .expect( (res) => {
                expect(res.body.text).toBe(text);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);                   // return - to stop execution flow
                }

                // check that data is in the DB
                Todo.find().then( (todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch( (e) => done(e) );             // using 'statement syntax', equiv
            });                                         // to (e) => { done(e); }
    }); // end it()

    it('should not create todo with invalid body data', (done) => {
        // CHALLENGE
        // send an empty object, should get a 400, length of todos should be 0

        request(app)
            .post('/todos')
            .send( {} )                                 // empty body is invalid
            .expect(400)                                // so status 400
            .end( (err, res) => {
                if (err) {
                    return done(err);                   // return - to stop execution flow
                }

                // check that data is NOT in the DB
                Todo.find().then( (todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch( (e) => done(e) );
            });        
    }); // end it()
});