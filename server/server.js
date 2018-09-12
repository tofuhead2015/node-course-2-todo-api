const mongoose = require('./db/mongoose.js').mongoose
const Todo = require('./models/todo').Todo
const {User} = require('./models/user')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res)=>{
    const todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc)
    }, e=>{
        res.status(400).send(e)
    })
})

app.listen(4000, ()=>{
    console.log('Started on port 4000')
})

module.exports = {app}