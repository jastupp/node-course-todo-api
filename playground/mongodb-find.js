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

        // db.collection('Todos').find({
        //     _id: new object_id('5c48ec6a60430363b7d8e98f')
        // }).toArray().then((docs) => {
        //     console.log('Todos');
        //     console.log(JSON.stringify(docs, undefined, 4));
        //
        // }, (error) => {
        //     console.log('Unable to fetch todos ', error);
        //
        // });

        // db.collection('Todos').find().count().then((count) => {
        //     console.log(`There are ${count} todos`);
        // }, (error) => {
        //     console.log('Unable to fetch todos ', error);
        // });


        db.collection('Users').find({name: 'Four'}).toArray().then((users) => {
            console.log('Users');
            console.log(JSON.stringify(users, undefined, 4));

        }, (error) => {
            console.log('Unable to fetch users ', error);

        });


        //client.close();
    }
});

