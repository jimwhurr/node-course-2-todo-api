const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodos = [
    {
        _id:  new ObjectID(),                           // _id added to support query tests
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo'
    }
];

beforeEach( (done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(testTodos);
    }).then( () => done() );
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
            .end( (err, res) => {                       // opportunity to do last checks
                if (err) {                              // e.g. examine state of DB
                    return done(err);                   // return - to stop execution flow
                }

                // check that data is in the DB
                Todo.find( {text} ).then( (todos) => {
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
                    expect(todos.length).toBe(testTodos.length);
                    done();
                }).catch( (e) => done(e) );
            });        
    }); // end it()
}); // end describe()


describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app).get('/todos')
            .expect(200)
            .expect( (res) => {
                expect(res.body.todos.length).toBe(testTodos.length);
            })
            .end(done);
    }); // end it()
}); // end describe()


describe('Get /todos/id', () => {
    it('should return todo doc', (done) => {
        request(app).get(`/todos/${testTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(testTodos[0].text)
            })
            .end(done);
    }); // end it()

    it('should return a 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app).get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);  
    }); // end it()

    it('should return 404 for none-object ids', (done) => {
        request(app).get('/todos/123')
            .expect(404)
            .end(done);
    }); // end it()
    
}); // end describe()