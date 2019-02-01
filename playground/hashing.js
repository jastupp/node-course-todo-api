const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = { id: 7};

const token = jwt.sign(data, '123');
//const token1 = jwt.sign(data, '1234');
//const token2 = jwt.sign(data, '12345');

console.log(token);

var decoded = jwt.verify(token, '123');

console.log(decoded);


//console.log(token1);
//console.log(token2);


//const message = 'Hello There';
//const hash = SHA256(message).toString();

//console.log(hash);


// var token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data)).toString()
// };
//
// console.log(token);
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();
//
// const hash = SHA256(JSON.stringify(token.data)).toString();
//
// console.log(hash);
