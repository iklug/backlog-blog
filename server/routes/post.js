const {Router, request} = require('express');
const router = Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

function isAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.username === 'admin'){
        next();
    } else if(req.isAuthenticated()){
        res.redirect('/currentUser');
    } else {
        res.redirect('/log-in');
    }
};

// function checkAuth(req,res,next){
//     console.log('we are in checkAuth');
//     console.log(req.user);
//     if(req.isAuthenticated()){
//         return next();
//     } else {
//         return res.status(401).json({message:'/login'});
//     }
// }

function verifyToken(req,res,next) {
    //get auth header value
    console.log('alert: verifying token..');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(402).json({message: "aww booty"}); //== allows coercion
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData)=>{
        if(err) return res.status(401).json({message:'incorrect access token'});
        req.user = authData;
        console.log('this is getting passed on as req.user:',req.user);
        next();
    })
}
function verifyAdmin(req,res,next){
    if(req.user.username !== 'admin'){
        return res.status(401).json({message:'you do not have access to this feature'});
    }
    next();
}

//view all posts

router.get('/', verifyToken, async (req,res)=>{
   try {
    const allPosts = await Post.find().sort({timeStamp: -1});
    res.json(allPosts);
   } catch(err) {
    res.status(500).json({message: err.message});
   }
});

//view a single post

router.get('/:postId', async (req,res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        const comments = await Comment.find({parentPost: req.params.postId}).limit(10);
        const viewPost = {
            post: {...post._doc},
            comments: [...comments],
        }
        res.json(viewPost);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//view all that post's comments

router.get('/:postId/comments', async (req,res)=>{
    try {
        const comments = await Comment.find({parentPost: req.params.postId});
        res.json(comments);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//view all post's comments with more info

router.get('/:postId/comments-full', async(req,res)=>{
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


//add comment to viewed post

router.post('/:postId/comments', verifyToken, async (req,res)=>{
    try {
        const newComment = await Comment.create({
            commentAuthor: req.user._id,
            content: req.body.content,
            parentPost: req.params.postId,
        }
        );
        res.json(newComment);
} catch(err){
        res.status(401).json({message: err.message});
    }
});

//http://localhost:3000/posts/6562cc62c7f8fcb3a6b47e6c/comment
//{"content": "The birds are hopefully landing to roost for the winter"}

//view unpublished posts

router.get('/pending', isAdmin, async (req,res)=>{
    const posts = await Post.find({published: false});
    res.json(posts);
});

//add a single post -- auth needed

router.post('/', verifyToken, verifyAdmin, async (req,res)=>{
    
    try {
        const newPost = await Post.create(
          {
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
          }  
        );
        res.json(newPost._id);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

//delete a single post -- auth needed

router.delete('/:postId', verifyToken, async(req,res)=>{
    try {
        const deleted = await Post.deleteOne({"_id": req.params.postId});
        const deleteComments = await Comment.deleteMany({parentPost: req.params.postId});
        res.json(`post #${req.params.postId} deleted..`);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;