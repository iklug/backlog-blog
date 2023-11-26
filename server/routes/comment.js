const {Router} = require('express');
const User = require('../models/Comment');
const Post =  require('../models/Post');
const router = Router();

//view all comments associated with a specific blogpost

router.get('/', async (req,res)=>{
    try {
        const comments = await Comment.find({parentPost: req.parentPostId});
        res.json(comments);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//view all current user comments

//create comment

//ability to edit one of your own comments?

//delete your own comment?




module.exports = router;