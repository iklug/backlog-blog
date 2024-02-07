import { useState, useEffect } from "react";
import BannerAdmin from "../components/BannerAdmin";
import { useNavigate } from "react-router-dom";
import Comment from "../components/Comment";
import { remove, setUsername } from "../redux/authSlice";
import { useDispatch} from 'react-redux'
import setUsernameFromSession from "../utils/sessionUsername";

const Profile = () => {


    const [comments, setComments] = useState(null);
    const [username, setTheUsername] = useState(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();
   
    setUsernameFromSession();

    useEffect(()=>
        {if(!sessionStorage.getItem('username')){
        navigate('/login');
    }},[]);


    const getUsername = () => {
        
        return sessionStorage.getItem('username');
    }


    useEffect(()=>{
        if(!sessionStorage.getItem('username')){
            navigate('/login');
        } 
        const getProfileInfo = async() => {
            try {
                // const token = sessionStorage.getItem('jwt');
                const request = await fetch('https://backlog-blog.fly.dev/comments', {
                    credentials: 'include',
                    // headers: {
                    //     'Authorization': `Bearer ${token}`
                    // }
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

    const logoutUser = async() => {
      try {
        // const token = sessionStorage.getItem('jwt');
        const request = await fetch("https://backlog-blog.fly.dev/logout", {
            method: 'GET',
            credentials: 'include',
            // headers: {
            //     'Authorization': `Bearer ${token}`
            // },
            });
        
        if(!request.ok){
            throw new Error('unable to logout? go figure');
        }
        const data = await request.json();
        // sessionStorage.setItem('jwt', null);
        // sessionStorage.setItem('refreshToken', null);
        console.log('user should be logged out', data);
        // dispatch(remove());
        sessionStorage.removeItem('username');
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    }
    

    return (
       <div className="bg-gradient-to-tr from-cyan-300 from-1% via-40% to-99% via-slate-100 to-purple-400 min-h-screen">
        <BannerAdmin/>
        <div className=" w-5/12 min-w-450 min-h-screen flex flex-col items-center m-auto bg-white overflow-scroll">
            <div className="flex items-center gap-5 mt-24">
                <div className=" border-4 border-gray-400 h-32 w-32 rounded-full flex justify-center items-center">Profile Picture</div>
                <div className="flex flex-col">
                    <div className="text-2xl ">{getUsername()}'s profile</div>
                    <div onClick={()=>{logoutUser()}}>logout</div>
                </div>
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