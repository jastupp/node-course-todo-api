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

        // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) => {
        //     console.log('Deleted ', result)
        // });

        // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
        //     console.log('Deleted ', result)
        // });

        // db.collection('Todos').findOneAndDelete({text: 'Eat Lunch'}).then((result) => {
        //     console.log('Deleted ', result)
        // });


        // db.collection('Users').deleteMany({name: 'Four'}).then((result) => {
        //     console.log('Deleted '+ result.result.n + ' Item(s)');
        // });


        db.collection('Users').findOneAndDelete({_id: 222}).then((result) => {
            console.log('Deleted ', result.value);
        });

        //client.close();
    }
});

