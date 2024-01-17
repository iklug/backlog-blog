const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: 'null',
    }
});

module.exports = mongoose.model('User', UserSchema);