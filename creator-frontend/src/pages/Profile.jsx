import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import { useNavigate } from "react-router-dom";
import Comment from "../components/Comment";

const Profile = () => {

    const [comments, setComments] = useState(null);
    const [username, setUsername] = useState(null);

    const getUsername = () => {
        return sessionStorage.getItem('username');
    }


    useEffect(()=>{
        const getProfileInfo = async() => {
            try {
                const token = sessionStorage.getItem('jwt');
                const request = await fetch('http://localhost:3000/comments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if(!request.ok){
                    throw new Error('could not connect to db');
                }
                const comments = await request.json();
                console.log(comments);
                setComments(comments);
            
            } catch (error) {
                console.error(error);
            }
        }
        getProfileInfo();
    }, [])


    

    return (
       <div>
        <Banner/>
        <div>
            <div>Profile Picture</div>
            <div>{getUsername()}</div>
        </div>
        {comments &&
        <div className="flex flex-col ml-6 overflow-auto h-128 w-96">{comments.map(item => <Comment username={item.commentAuthor.username} key={item._id} time={item.timeStamp} content={item.content}></Comment>)}</div>
       }</div>
    )
}

export default Profile;