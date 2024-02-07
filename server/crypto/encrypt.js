const crypto = require('crypto'); //we need to require the crypto library .. it's a library -- so 
                                    //it's gonna be full of features to use (like a class, or object);

//for digital signature
                                    
function encryptWithPublicKey(publicKey, message){

    const bufferMessage = Buffer.from(message, 'utf8');

    return crypto.publicEncrypt(publicKey, bufferMessage);
}

//remember: we encrypt with different keys depending on the use case.


//for digital signature
function encryptWithPrivateKey(privateKey, message){
    const bufferMessage = Buffer.from(message, 'utf8');

    return crypto.privateEncrypt(privateKey, bufferMessage);
}

module.exports.encryptWithPublicKey = encryptWithPublicKey;
module.exports.encryptWithPrivateKey = encryptWithPrivateKey;
