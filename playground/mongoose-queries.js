const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/Todo')
const {ObjectID} = require('mongodb')

const id = '5b9a6466df82b04310267a4a1'

if (!ObjectID.isValid(id)){
    console.log('ID not valid')
}

Todo.find({
    _id: id
}).then((todos)=>{
    console.log('Todos', todos)
})

Todo.findOne({
    _id: id
}).then((todo)=>{
    console.log('Todo', todo)
})

Todo.findById(id).then((todo)=>{
    if (!todo) {
        return console.log('Id not found')
    }
    console.log('Todo', todo)
}).catch(e=>{
    console.log(e)
})