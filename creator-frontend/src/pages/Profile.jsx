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
       <div className="bg-gradient-to-tr from-cyan-300 from-1% via-40% to-99% via-slate-100 to-purple-400 min-h-screen">
        <Banner/>
        <div className=" w-5/12 min-w-450 min-h-screen flex flex-col items-center m-auto bg-white overflow-scroll">
            <div className="flex items-center gap-5 mt-24">
                <div className=" border-4 border-gray-400 h-32 w-32 rounded-full flex justify-center items-center">Profile Picture</div>
                <div className="text-2xl ">{getUsername()}'s profile</div>
            </div>
            <div className="border-t-gray-100 border w-96 mt-2"></div>
            <div className="mt-6 ml-6">Your Comments:</div>
            {comments &&
            <div className="flex flex-col ml-6 overflow-auto h-128 w-96">{comments.map(item => <Comment username={item.commentAuthor.username} key={item._id} time={item.timeStamp} content={item.content}></Comment>)}</div>
                   }
        </div>
        </div>
    )
}

export default Profile;