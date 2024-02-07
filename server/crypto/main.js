const fs = require('fs');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');

const publicKey = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');

//Stores a Buffer object
const encryptedMessage = encrypt.encryptWithPublicKey(publicKey, 'Super secret message');

//if you try to crack the code you will get gibberish
// console.log(encryptedMessage.toString());
//this gibberish is what will be transported through any insecure transport layer

const privateKey = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');

const decryptedMessage = decrypt.decryptWithPrivateKey(privateKey, encryptedMessage);

console.log(decryptedMessage.toString());

