// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if (err){
        console.log('Unable to connect to MongoDB server')
        return
    }
    console.log('Connected to MongoDB server')

    const db = client.db('TodoApp')

    db.collection("Todos").findOneAndUpdate(
        {_id: new ObjectID('5b9121d68bb66d8aaca1334a')},
        {$set: {completed: true}},
        {returnOriginal: false})
        .then((result)=>{
            console.log(result)
        })
    //client.close()

    db.collection("Users").findOneAndUpdate(
        {_id: new ObjectID('5b8bf9b071205c564c576830')},
        {$set: {name: 'Kai'}, 
        $inc: {age: 1}},
        {returnOriginal: false})
        .then(result=>{
            console.log(result)
        })    
})