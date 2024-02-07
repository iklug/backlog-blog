const crypto = require('crypto');
const hash = crypto.createHash('sha256'); //trapdoor function that takes data (no matter how large
const fs = require('fs');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');

const myData = {
    firstName: 'Ian',
    lastName: 'Klug',
    socialSecurity: 'No! never put personal info in a digitally signed message \
    because this form of cryptography does not hide data!'
};

//this is going to be the data that we are going to sign

//signing data does not protect the data itself -- 

//string data of our data that can be hashed
const myDataString = JSON.stringify(myData);

//sets the value on the hash object: requires string format, so we convert the object
hash.update(myDataString);

//hashed data in hexidecimal format
const hashedData = hash.digest('hex');


const senderPrivateKey = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');

const signedMessage = encrypt.encryptWithPrivateKey(senderPrivateKey, hashedData);

//this is where we have an extra step 
//the receiver of the data needs a bit more information 
//which hash function was used, the data itself

const packageOfDataToSend = {
    algorithm: 'sha256',
    originalData: myData,
    signedAndEncryptedData: signedMessage,
};

module.exports.packageOfDataToSend = packageOfDataToSend;