
import { useParams } from "react-router-dom";
import BannerAdmin from "../components/BannerAdmin";
import Comment from "../components/Comment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../redux/authSlice";

import { useSelector, useDispatch } from "react-redux";
import { selectPostById, selectPosts, removePostById } from "../redux/postsSlice";


const Post = () => {

    const navigate = useNavigate();
    
const [thisPost, setThisPost] = useState(null);
const [viewComments, setViewComments] = useState(false);
const [comments, setComments] = useState(null);
const [commentBody, setCommentBody] = useState(null);
const {id} = useParams();

const dispatch = useDispatch();
const auth = useSelector(selectAuth);

const posts = useSelector(selectPosts);
const post = useSelector(posts => selectPostById(posts, id));
console.log('this should be the post 🐰 ',post)
console.log('this should be the posts ',posts)


useEffect(()=>{
    if(thisPost == null){
        const retrieveData = async()=> {
            try{
        const request = await fetch(`http://localhost:3000/posts/${id}`, {
            credentials: 'include',
        });
        if(!request.ok){
        throw new Error('oops');
        }
        const data = await request.json();
        console.log('🦊🦊🦊🦊', data);            
        setThisPost({...data})      
        } catch (error) {
        console.error(error);
        }}
    retrieveData();
    }
}, []);

useEffect(()=>{
    if(viewComments && comments === null){
        const getComments = async()=>{
            try {
                const request = await fetch(`http://localhost:3000/posts/${id}/comments-full`, {
                    credentials: 'include',
                });
                if(!request.ok){
                    throw new Error('oopsies');
                }
                const data = await request.json();
                console.log('helloooo',data);
                setComments(data);
               
            } catch (error) {
                console.error(error);               
            }
        }
        getComments();
    }
}, [viewComments])

const submitComment = async() => {
    try {
        const token = sessionStorage.getItem('jwt');
        console.log('token up in here: ', token);
        const request = await fetch(`http://localhost:3000/posts/${id}/comments`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content: commentBody
            })  
        });
        if(!request.ok){
            throw new Error('error at request');
        }
        const data = await request.json();
        console.log(data);
        setCommentBody(null);
        setComments(null);
        setViewComments(true);
    } catch (error) {
       console.error(error); 
    }
    
}

const deletePost = async() => {
        try {
            // const token = sessionStorage.getItem('jwt');
            // console.log('token up in here: ', token);
            const request = await fetch(`http://localhost:3000/posts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                }
            });
            if(!request.ok){
                throw new Error('error at request');
            }
            const data = await request.json();
            console.log('this is the id we removing', id);
            dispatch(removePostById(id));
            console.log(data);
            navigate(`/`);
        } catch (error) {
           console.error(error); 
        }
        
    
    }
    

    return (
        <div className=" h-screen">
            <BannerAdmin/>
        <div id='postContent' className=" mt-12 h-screen w-full bg-scroll bg-repeat bg-cover pt-16 bg-gradient-to-tr from-cyan-300 from-1% via-40% to-99% via-slate-100 to-purple-400">
            {post && <div>
                <div id="postBody" className=" w-7/12 m-auto p-10 border-2 bg-white rounded-xl shadow-lg whitespace-normal">
                {post.author.username === sessionStorage.getItem('username') && <div onClick={deletePost} className=" text-xl font-bold float-right -mt-10 -mr-8 text-slate-300 cursor-pointer">x</div>}

                    <div className=" text-4xl text-gray-800">{post.title}</div>
                    <div id="smallerDetails">
                        <div className="font-semibold text-sm mt-2">by {post.author.username}</div>
                        <div className="text-xs font-thin border-b-2 border-slate-50 w-32">{'posted '+ post.timeStamp.slice(0,10)}</div>
                    </div>
                    <div className="whitespace-normal mt-2">{post.content}</div>
                </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <div className="flex justify-center items-center w-36 bg-cyan-100 text-slate-600 rounded-lg drop-shadow-md" onClick={()=>{setCommentBody(''); setViewComments(false)}}>New Comment</div>
                        <div onClick={()=>setViewComments(!viewComments)} className="bg-white h-10 w-36 text-slate-600 flex justify-center items-center rounded-md shadow-sm">{viewComments ? `Hide Comments`:`View Comments`}</div>
                    </div>
            </div>}
            {commentBody !== null &&
                <div className="flex flex-col items-center mt-4 gap-4 ">
                    <textarea value={commentBody} onChange={(e)=>setCommentBody(e.target.value)} name="newComment" id="newComment" cols="40" rows="10" placeholder="what it do?" className="p-2"></textarea>
                    <div className="flex gap-6">
                        <button onClick={()=>submitComment()}className="bg-white shadow-md w-32">post</button>
                        <button onClick={()=>setCommentBody(null)} className="bg-white shadow-md w-16">stop</button>
                    </div>
                </div>
            }
                {comments !== null && viewComments &&
                <div className="m-auto w-96 mt-4 overflow-auto h-1/2 rounded-xl">
                {comments.length < 1 ? <div className="bg-white rounded-lg text-center">No comments yet.. be the first!</div> : comments.map(item => <Comment username={item.commentAuthor.username} content={item.content} time={item.timeStamp} key={item._id}/>)}
                </div>
                }
           
        </div>
        </div>
    )
}

export default Post;