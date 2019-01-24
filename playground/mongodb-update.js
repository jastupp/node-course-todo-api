const client = require('mongodb').MongoClient;
const object_id = require('mongodb').ObjectID;

const obj = new object_id();
console.log('Object ID', obj);


client.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if(error) {
        console.log('Unable to connect to mongo db server.');
    } else {
        console.log('Connected to database ....');

        const db = client.db('TodoApp');

        // db.collection('Todos').findOneAndUpdate(
        //     {text: 'Eat Lunch'},
        //     {$set: {completed: true}},
        //     {returnOriginal: false}).
        // then((result) => {
        //     console.log('Updated ', result);
        // });

        db.collection('Users').findOneAndUpdate(
            {name: 'John'},
            {$set: {name: 'John'}, $inc: {age: 1}},
            {returnOriginal: false}).
        then((result) => {
            console.log(result);
        });

        //client.close();
    }
});

