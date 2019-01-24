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

        // db.collection('Todos').insertOne(
        //     {text: 'Something to do', completed: false},
        //     (error, result) => {
        //         if(error)  {
        //             console.log('Unable to insert..');
        //         } else {
        //             console.log(JSON.stringify(result.ops, undefined, 4));
        //         }
        //     }
        // );

        // db.collection('Users').insertOne(
        //     {name: 'Name', age: 23, location: 'Location'},
        //     (error, result) => {
        //         if(error)  {
        //             console.log('Unable to insert..');
        //         } else {
        //             console.log(result.ops[0]._id.getTimestamp());
        //         }
        //     }
        // );

        client.close();
    }
});

