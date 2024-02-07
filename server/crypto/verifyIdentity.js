const crypto = require('crypto');
const fs = require('fs');
const decrypt = require('./decrypt');

//this is the data we are receiving from the sender

const receivedData = require('./signMessage').packageOfDataToSend;

//we need to make sure we use the same hash that was used to hash the original data
const hash = crypto.createHash(receivedData.algorithm);

const publicKey = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');

const decryptedMessage = decrypt.decryptWithPublicKey(publicKey, receivedData.signedAndEncryptedData);
//that will return a hashed value

//if we take a hash of the original data -- we will know that it was not only not tampered with
//but also signed by the person it says it was signed by -- if they match of course

const decryptedMessageHex = decryptedMessage.toString();

const hashOfOriginal = hash.update(JSON.stringify(receivedData.originalData));
const hashOfOriginalHex = hash.digest('hex');

hashOfOriginalHex === decryptedMessageHex ? console.log('success') : console.log('uh oh.. something is wrong');

//and there you have it, that's how you use a digital signature
//this is sort of the same thing that happens with JWTs -- 
