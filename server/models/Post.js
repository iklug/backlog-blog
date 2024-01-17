const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const PostSchema = new Schema({
    title: {
        type: String,
        minLength: 1,
        maxLength: 85,
        required: true,
    },
    content: {
        type: String,
        minLength: 1,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timeStamp: {
        type: Date,
        default: ()=>Date.now(),
    },
    published: {
        type: Boolean,
        default: true,
        required: true,
    },
});

module.exports = mongoose.model('Post', PostSchema);