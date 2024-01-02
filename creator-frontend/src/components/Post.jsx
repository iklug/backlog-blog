import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const Post = ({title, content, author, date, id}) => {

const navigate = useNavigate();

    return (
        <div className=" m-4 pb-4 border-b-2 border-slate-100" onClick={()=>navigate(`/posts/${id}`)}>
            <div className=" text-3xl font-bold text-gray-800">{title}</div>
            <div className="ml-2">
                <div className=" font-semibold text-gray-700">{'by '+author}</div>
                <div className=" text-xs text-gray-500">{new Date(date).toDateString()}</div>
            </div>
            <div className="mt-2 ml-2">
            <div className="text-gray-700">{content.length > 250 ? content.slice(0,250) + '...' : content}</div>
            </div>
        </div>
    )
}

export default Post;