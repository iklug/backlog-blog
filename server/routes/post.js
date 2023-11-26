const {Router} = require('express');
const router = Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');


//view all posts

router.get('/', async (req,res)=>{
   try {
    const allPosts = await Post.find();
    res.json(allPosts);
   } catch(err) {
    res.status(500).json({message: err.message});
   }
});

//view a single post

router.get('/:postId', async (req,res)=>{
    try {
        const post = await Post.find({"_id": req.params.postId});
        const comments = await Comment.find({parentPost: req.params.postId});
        const entirePost = {
            ...post, ...comments};
        res.json(entirePost);
} catch(err){
        res.status(500).json({message: err.message});
    }
});

//add comment to viewed post

router.post('/:postId/comment', async (req,res)=>{
    try {

        const newComment = await Comment.create({
            commentAuthor: req.user,
            content: req.body.content,
            parentPost: req.params.postId,
        }
        );
        res.json(newComment);
} catch(err){
        res.status(500).json({message: err.message});
    }
});

//http://localhost:3000/posts/6562cc62c7f8fcb3a6b47e6c/comment
//{"content": "The birds are hopefully landing to roost for the winter"}

//view unpublished posts


//add a single post -- auth needed

router.post('/submit', async (req,res)=>{
    try {
        const newPost = await Post.create(req.body);
        res.send('added new post to database');
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

//delete a single post -- auth needed

router.delete('/:postId', async(req,res)=>{
    try {
        const deleted = await Post.deleteOne({"_id": req.params.postId});
        res.send(`post #${req.params.postId} deleted..`);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});








module.exports = router;