const crypto = require('crypto');

const genPassword = (password) => {
    //salt - pseudo random value
    let salt = crypto.randomBytes(32).toString('hex');
    //pass in salt and plain text password -- 10000 = iterations, 64 = how long, 'sha' = is a hashingFunc
    let genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash,
    }
};

const validatePassword = (password, hash, salt) => {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
};

module.exports.validatePassword = validatePassword;
module.exports.genPassword = genPassword;

//never store a plaintext password in a database
