import { useEffect } from "react";

import Banner from "../components/Banner";
import Post from "../components/Post";

const Home = ({setPosts, posts, handleSelect}) => {

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
            <Banner/>
            {posts.map(item => <Post key={item._id} id={item._id} title={item.title} 
            content={item.content} author='Admin' date={item.timeStamp} handleSelect={handleSelect}/>)}
        </div>
    )
}

export default Home;