
const Comment = ({username, time, content}) => {
    return (
        <div className=" w-96 border-2 border-b-slate-50 bg-white p-2">
            <div className="flex gap-6 items-center">
                <div className="font-bold">{username}</div>
                <div className="font-thin text-xs">{new Date(time).toDateString()}</div>
            </div>
            <div>
                <div>{content}</div>
            </div>
        </div>
    )
}

export default Comment;