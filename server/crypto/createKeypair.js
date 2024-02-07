const crypto = require('crypto'); //built in node.js crypto library
const fs = require('fs'); // built in node.js file system

function generateKeypair() {
    //generates an object where the keys are stored in properties 'privateKey and 'publicKey
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', //Public Key Cryptography Standards 1"
            format: 'pem' // most common formatting choice
        }
    });
//this uses the file system to write it
    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey); // for public
    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey); // for private

};
//this function represents all the complex math we talked about in crypto.js

generateKeypair();



