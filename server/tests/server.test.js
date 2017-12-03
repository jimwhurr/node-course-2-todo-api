const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {testTodos, populateTodos, users, populateUsers} = require('./seed/seed');

// Can extend latest version of expect, e.g...
// expect.extend({
//     toEqualString(received, argument) {
//         const pass = (received === argument);

//         if (pass) {
//             return {
//                 message: () => `expected ${received} not to match ${argument}`,
//                 pass: true
//             };
//         }
//         else {
//             return {
//                 message: () => `expected ${received} to match ${argument}`,
//                 pass: false
//             };
//         }     
//     }
// });

beforeEach(populateUsers);
beforeEach(populateTodos);

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


describe('GET /todos/id', () => {
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


describe('DELETE /todos/:id', () => {
    const hexId = testTodos[0]._id.toHexString();

    it('should remove a todo, returning the doc', (done) => {
        request(app).delete(`/todos/${hexId}`)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);                   // return - to stop execution flow
                }

                // check that data is NOT in the DB
                Todo.findById(hexId).then( (todo) => {
                    expect(todo).toBe(null);;
                    done();
                }).catch( (e) => done(e) );
            });        
    }); // end it()

    it('should return 404 if the todo not found', (done) => {
        const id = new ObjectID();
        request(app).delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);  
    })// end it()

    it('should return 404 if bad id', (done) => {
        request(app).delete('/todos/123ABC')
            .expect(404)
            .end(done);
    }); // end it()
}); // end describe()


describe('PATCH /todos/:id', () => {

    // update text and completed to true
    // 200
    // response body is changed, completed true, completedAT set to number

    it('should update the todo', (done) => {
        const hexId = testTodos[0]._id.toHexString();
        const text = 'Updated first item';

        request(app).patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text: text
            })
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    }); // end it()

    // update text and completed to true
    // 200
    // response body is changed, completed true, completedAT set to number

    it('should clear completedAt when todo changed to uncompleted', (done) => {
        const hexId = testTodos[1]._id.toHexString();
        const text = 'completely new text';
        request(app).patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text: text
            })
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    
    }); // end it()
}); // end describe()


describe('GET /users/me', () => {
    it('should return a user if authenticated', (done) => {
        request(app).get('/users/me')
            .set('x-auth', users[0].tokens[0].token)        // set the auth token
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    }); // end it()

    it('should return a 401 if authetication fails', (done) => {
        // users/me - expect 401, body empty, toEqual
        request(app).get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            }).end(done);   
    }); // end it()    
}); // end describe()


describe('POST /users', () => {
    it('should create a new user in the DB', (done) => {
        const email = 'testuser@test.com';
        const password = 'testPassword1';

        request(app).post('/users')
            .send({email, password})            // E6 ver of {email: email, password: password}
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    return done();
                });
            });
    }); // end it()

    it('should return validation errors if request invalid', (done) => {
        const email = 'bad@.com';
        const password = "123";

        request(app).post('/users')
            .send({email, password})            // E6 ver of {email: email, password: password}
            .expect(400)
            .end(done);
    }); // end it()

    it('should not create user if email is a duplicate', (done) => {
        request(app).post('/users')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(400)
            .end(done);
    }); // end it()             
}); // end describe()