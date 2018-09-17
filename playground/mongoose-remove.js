const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/Todo')
const {ObjectID} = require('mongodb')
const {User} = require('./../server/models/user')

// Todo.remove
// Todo.remove({}).then(result=>{
//     console.log(result)
// })

// Todo.findOneAndRemove()

Todo.findByIdAndRemove('5b9a6466df82b04310267a4a').then((todo)=>{
    console.log(todo)
})