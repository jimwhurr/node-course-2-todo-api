const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

// // create the salt
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

const hashedPassword = '$2a$10$PSWWKiiovIzA52SanFrcnuXHkfrFgG95eNlVvMn6127dMRarEASMa';

bcrypt.compare('123abc;', hashedPassword, (err, res) => {
    console.log(res);
});

// let data = {
//     id: 10 
// };

// const token = jwt.sign(data, '123abc');
// console.log(token);

// const decoded = jwt.verify(token, '123abc');
// console.log('decoded...', decoded);

//const message = 'I am new at this';
//const hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// };

// // try hackig the data
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(data)).toString();

// // to validate the token...
// const resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString();

// if (resultHash === token.hash) {
//     console.log('Data integrity');
// }
// else {
//     console.log('Data compromised');
// }

// // NOTE: this is the basis of Jason Web Tokens (JWT)