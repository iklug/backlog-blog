import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Protected = () => {


    const [words, setWords] = useState('');
    
    useEffect(()=>{
            const accessProtected = async()=>{
                try {
                    const request = await fetch(`https://backlog-blog.fly.dev/protected`, {
                        methd: 'GET',
                        credentials: 'include',
                    });
                    if(!request.ok){
                        throw new Error('request is not ok');
                    }
                    const data = await request.json();
                    setWords(data);
                   
                } catch (error) {
                    console.error(error);               
                }
            }
            accessProtected();
        }, [])

return (
    <div>{words}</div>

)
}

export default Protected;