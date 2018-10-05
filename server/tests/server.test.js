const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        const text = 'Test todo text'

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text)
        })
        .end((err, res)=>{
            if (err){
                return done(err)
            }
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done()
            }).catch(e=>done(e))
        })
    })

    it('should not create todo with invalid body data', (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)        
        .end((err, res)=>{
            if (err){
                return done(err)
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2)                
                done()
            }).catch(e=>done(e))
        })
    })    
})

describe('GET /todos', ()=>{
    it('should get all todos', (done)=>{      

        request(app)
        .get('/todos')        
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2)            
        })
        .end(done)               
    })
})

describe('GET /todos/:id', ()=>{
    it('should get one todo', (done)=>{      
        request(app)
        .get('/todos/' + todos[0]._id.toHexString())        
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)            
        })
        .end(done)               
    })

    it('should get no todo', (done)=>{      
        request(app)
        .get('/todos/' + new ObjectID().toHexString)        
        .expect(404)
        .expect((res)=>{
            expect(res.body.todo).toBe(undefined)            
        })
        .end(done)               
    })

    it('should get no todo due to invalid ID', (done)=>{      
        request(app)
        .get('/todos/5b9a6466df82b04310267a4a1')        
        .expect(404)
        .expect((res)=>{
            expect(res.body.todo).toBe(undefined)            
        })
        .end(done)               
    })
})

describe('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        const hexId = todos[1]._id.toHexString()

        request(app)
        .delete('/todos/' + hexId)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo._id).toBe(hexId)
        })
        .end((err, res)=>{
            if (err){
                return done(err)
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBe(null)              
                done()
            }).catch(e=>{
                done(e)
            })
        })
    })

    it('should return 404 if todo not found', (done)=>{
        request(app)
        .delete('/todos/' + new ObjectID().toHexString)        
        .expect(404)        
        .end(done)  
    })

    it('should return 404 if object id is invalid', (done)=>{
        request(app)
        .delete('/todos/5b9a6466df82b04310267a4a1')        
        .expect(404)        
        .end(done) 
    })
})

describe('PATCH /todos/:id', ()=>{
    it('should update a todo', (done)=>{
        const hexId = todos[0]._id.toHexString()
        request(app)
        .patch('/todos/' + hexId)
        .send({text:'wash car', completed: true})
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe('wash car')
            //expect(isNumber(res.body.todo.completedAt))
            expect(res.body.todo.completed).toBe(true)
        })
        .end(done)
    })

    it('should clear completedAt when todo is not completed', done=>{
        const hexId = todos[1]._id.toHexString()
        request(app)
        .patch('/todos/' + hexId)
        .send({text:'walk the dog', completed: false})
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe('walk the dog')
            expect(res.body.todo.completedAt).toBe(null)
            expect(res.body.todo.completed).toBe(false)
        })
        .end(done)
    })
})

describe('GET /users/me', ()=>{
    it('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })
    it('should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res=>{
                expect(res.body).toEqual({})                
            })
            .end(done)
    })
})

describe('POST /users', ()=>{
    it('should create a user', done=>{
        const email = 'kaihu12@email.com'
        const password = '123abc!'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res=>{
                expect(res.headers['x-auth']).toBeTruthy()
                expect(res.body._id).toBeTruthy()
                expect(res.body.email).toBe(email)
            })
            .end(err=>{
                if (err){
                    return done(err)
                }
                User.findOne({email}).then((user)=>{
                    expect(user).toBeTruthy()
                    expect(user.password).not.toBe(password)
                    done()
                })
            })
    })
    it('should return validation errors if request invalid', done=>{
        request(app)
            .post('/users')
            .send({email:'123', password:'456'})
            .expect(400)
            .end(done)
    })
    it('should not create user if email in use', (done)=>{
        request(app)
            .post('/users')
            .send({email:users[0].email, password:users[0].password})
            .expect(400)
            .end(done)
    })
})