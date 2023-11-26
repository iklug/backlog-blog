const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const CommentSchema = new Schema({
    commentAuthor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        minLength: 1,
        maxLength: 200,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: ()=>Date.now(),
    },
    parentPost: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
});

module.exports = mongoose.model('Comment', CommentSchema);