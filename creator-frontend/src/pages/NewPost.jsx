import { useState } from "react";
import BannerAdmin from "../components/BannerAdmin";
import { useNavigate } from "react-router-dom";

const NewPost = () => {

const [title, setTitle] = useState('');
const [content, setContent] = useState('');

const navigate = useNavigate();

const submitPost = async() => {
    try {
        const token = sessionStorage.getItem('jwt');
        console.log('token up in here: ', token);
        const request = await fetch(`http://localhost:3000/posts/`, {
            method: 'POST',
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
        <div className=" h-screen">
            <BannerAdmin/>
            <div id='postContent' className="mt-12 h-screen w-full bg-scroll bg-repeat bg-cover pt-16 bg-gradient-to-tr from-cyan-300 from-1% via-40% to-99% via-slate-100 to-purple-400">
        
                <div id="postBody" className=" w-7/12 h-4/6 m-auto p-10 border-2 bg-white rounded-xl shadow-lg whitespace-normal">
                    <div id="smallerDetails">
                    <textarea name='title' placeholder="Title" value={title} 
                    onChange={(e)=>{let value = e.target.value; title.length < 80 ? setTitle(value) : setTitle(value.slice(0,85))}} 
                    className=" appearance-none focus:outline-none text-2xl w-full whitespace-normal resize-none font-bold" />
                    <div className="flex justify-end gap-8"> 
                        <div className=" text-gray-700 font-light text-center text-xs rounded-lg bg-cyan-100 border-cyan-200 border w-12">{title.length}/80</div>
                    </div>
                        <div className="font-semibold text-sm -mt-4">by Admin</div>
                        <div className="text-xs font-thin border-b-2 border-slate-50 w-32 pb-2">Time</div>
                    </div>
                    <div className="flex">
                        <textarea name='content' placeholder="What's happening?" value={content} onChange={(e)=>setContent(e.target.value)}
                         className="mt-2 appearance-none focus:outline-none text-lg w-full h-52 whitespace-normal resize-none" />
                    </div>
                    <div className="flex justify-end items-end">
                        <button className=" shadow-sm bg-cyan-100 rounded-lg text-gray-700 h-12 w-20" onClick={submitPost}>Post</button>
                    </div>
                </div>
        
            </div>
        </div>
        )
}

export default NewPost;