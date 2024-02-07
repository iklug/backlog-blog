const {Schema} = require('mongoose');
const mongoose = require('mongoose');

// const UserSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//     },
//     refreshToken: {
//         type: String,
//         default: 'null',
//     },
//     hash: {type: String},
//     salt: {type: String},
// });
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    hash: {
        type: String,
    },
    salt: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false,
    }
});

const collectionName = 'sessionUsers';

module.exports = mongoose.model('User', UserSchema);