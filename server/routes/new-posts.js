const {Router} = require('express');
const router = Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const checkAuth = require('../auth').checkAuth;
const checkNoAuth = require('../auth').checkNoAuth;
const checkAdmin = require('../auth').checkAdmin;

//GET to localhost:3000/posts should return all posts
router.get('/',checkAuth, async (req,res)=>{

    try {
        const allPosts = await Post.find().sort({timeStamp: -1}).populate({path: 'author', select: 'username'});
        res.json(allPosts);
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }

 });

router.get('/:postId', checkAuth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.postId).populate({path: 'author', select: 'username'});
        // const comments = await Comment.find({parentPost: req.params.postId}).limit(10);
        // const viewPost = {
        //     post: {...post._doc},
        //     comments: [...comments],
        // }
        res.json(post);
        //doing this will break my frontend, but i'm not currently using this so..
        //but i've hypothetically fixed that
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/:postId/comments-full', checkAuth, async(req,res)=>{
    try {
        const commentsWithAuthors = await Comment.find({parentPost: req.params.postId}).sort({timeStamp: -1}).populate({
            path: 'commentAuthor',
            select: 'username',
        });
        res.json(commentsWithAuthors);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/:postId/comments', checkAuth, async (req,res)=>{
    console.log(req.user);
    try {
        const newComment = await Comment.create({
            commentAuthor: req.user._id,
            content: req.body.content,
            parentPost: req.params.postId,
        }
        );

        res.json(`comment submitted by ${req.user.username}`);
} catch(err){
        res.status(401).json({message: err.message});
    }
});

router.post('/', async (req,res)=>{
    
    try {
        const newPost = await Post.create(
          {
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
          }  
        );
        const fullPost = await Post.findById(newPost._id).populate({path: 'author', select: 'username'});
        res.json(fullPost);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

router.delete('/:postId', checkAuth, async(req,res)=>{
    try {
        const deleted = await Post.deleteOne({"_id": req.params.postId});
        const deleteComments = await Comment.deleteMany({parentPost: req.params.postId});
        res.json(`post #${req.params.postId} deleted..`);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;