const {Router} = require('express');
const User = require('../models/Comment');
const Post =  require('../models/Post');
const Comment = require('../models/Comment');
const router = Router();

function checkAuth(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/log-in')
    }
};


//view all comments associated with a specific blogpost



//view all current user comments

router.get('/', checkAuth, async (req,res)=>{
    try {
        const comments = await Comment.find({commentAuthor: req.user._id});
        res.json(comments);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})
//create comment -- in the post route

//ability to edit one of your own comments?

router.put('/:commentId',checkAuth, async (req,res)=>{

    try {
        const comment = await Comment.findOne({_id: req.params.commentId});
    if(comment.commentAuthor.equals(req.user._id)){
        comment.content = req.body.content;
        await comment.save();
        return res.send('updated successfully');
        }
        return res.status(403).json({message: "You can only edit your own comments"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }; 
});

//delete your own comment?

router.delete('/:commentId',checkAuth, async (req,res)=>{

    try {
        const comment = await Comment.findOne({_id: req.params.commentId});
    if(comment.commentAuthor.equals(req.user._id)){
        await Comment.deleteOne({_id: req.params.commentId});
        return res.redirect('/comments');
        }
        return res.status(403).json({message: "You can only delete your own comments"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }; 
});



module.exports = router;