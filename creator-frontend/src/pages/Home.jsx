import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BannerAdmin from "../components/BannerAdmin";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../redux/authSlice";
import BannerUser from "../components/BannerUser";


const Home = ({setPosts, posts, handleSelect}) => {

const navigate = useNavigate();
const auth = useSelector(selectAuth);
console.log('🐶', auth);

const [isLoading, setIsLoading] = useState(true);

useEffect(()=>{
    const getPosts = async() => {
        try {
            const token = sessionStorage.getItem('jwt');
            const request = await fetch('http://localhost:3000/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(!request.ok){
                throw new Error('could not connect to db');
            }
            const postData = await request.json();
            console.log(postData);
            setPosts(postData);
            setIsLoading(false);
        
        } catch (error) {
            console.error(error);
        }
    }
    getPosts();
}, [])

const deletePost = async() => {
        try {
            const token = sessionStorage.getItem('jwt');
            console.log('token up in here: ', token);
            const request = await fetch(`http://localhost:3000/posts/`, {
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

    return (
        <div>
            {auth === 'admin' ? <BannerAdmin/> : <BannerUser/> }
            {isLoading ? <div className="mt-32 text-4xl">Loading posts..</div> 
            :<div className="mt-20">
                {posts.map(item => <Post key={item._id} id={item._id} title={item.title}
                content={item.content} author='Admin' date={item.timeStamp} handleSelect={handleSelect}/>)}
            </div>}
        </div>
    )
}

export default Home;