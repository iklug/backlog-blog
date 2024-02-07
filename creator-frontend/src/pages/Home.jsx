import { useEffect, useState } from "react";
import BannerAdmin from "../components/BannerAdmin";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../redux/authSlice";
import BannerUser from "../components/BannerUser";
import setUsernameFromSession from "../utils/sessionUsername";
import { setPosts, selectPosts } from "../redux/postsSlice";
import { useDispatch, useSelector } from 'react-redux'


const Home = ({handleSelect}) => {

const navigate = useNavigate();

useEffect(()=>
{if(!sessionStorage.getItem('username')){
    navigate('/login');
}}
,[]);


const [isLoading, setIsLoading] = useState(true);
const dispatch = useDispatch();
const posts = useSelector(selectPosts);

useEffect(()=>{

    setUsernameFromSession();

    if(posts.length < 1){const getPosts = async() => {
        try {
            const token = sessionStorage.getItem('jwt');
            const request = await fetch('https://backlog-blog.fly.dev/posts', {
            // const request = await fetch('http://localhost:3000/posts', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(!request.ok){
                throw new Error('could not connect to db');
            }
            const postData = await request.json();
            console.log('🐸🐸🐸🐸',postData);
            // setPosts(postData);
            dispatch(setPosts(postData));
            setIsLoading(false);
        
        } catch (error) {
            console.error(error);
        }
    }
    getPosts();}
}, [])

const deletePost = async() => {
        try {
            const token = sessionStorage.getItem('jwt');
            console.log('token up in here: ', token);
            const request = await fetch(`https://backlog-blog.fly.dev/posts/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                })  
            });
            if(!request.ok){
                throw new Error('error at request');
            }
            const data = await request.json();
            navigate(`/posts/${data}`);
        } catch (error) {
           console.error(error); 
        }
        
    
}

console.log('these are redux posts: ', posts);

    return (
        <div>
            <BannerAdmin/>
            {isLoading && posts.length < 1 ? <div className="mt-32 text-4xl">Loading posts..</div> 
            :<div className="mt-20">
                { posts.map(item => <Post key={item._id} id={item._id} title={item.title}
                content={item.content} author={item.author.username} date={item.timeStamp} handleSelect={handleSelect}/>)}
            </div>}
        </div>
    )
}

export default Home;