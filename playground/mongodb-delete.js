// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if (err){
        console.log('Unable to connect to MongoDB server')
        return
    }
    console.log('Connected to MongoDB server')

    const db = client.db('TodoApp')

    // deleteMany
    // db.collection("Todos").deleteMany({text: 'Eat Lunch'}).then((result)=>{
    //     console.log(result)
    // })
    db.collection("Users").deleteMany({name: 'Kai'}).then(result=>{
        console.log(result)
    })

    // deleteOne
    // db.collection("Todos").deleteOne({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result)
    // })

    //findOneAndDelete
    // db.collection("Todos").findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result)
    // })
    db.collection("Users").findOneAndDelete({_id: new ObjectID('5b8bf7beea31191f08d50055')}).then(result=>{
        console.log(result)
    })
    //client.close()
})