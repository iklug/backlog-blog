import Button from '../components/Button'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

const navigate = useNavigate();


const attemptSignUp = async() => {
    try {
        const request = await fetch("http://localhost:3000/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        if(!request.ok){
            throw new Error('unable to perform request');
        }
        const data = await request.json();
        // setJWT(data.accessToken);
        // setRefreshToken(data.refreshToken);
        console.log(data);
    } catch(error){
        console.error(error);
        setUsername('');
        setPassword('');
        setErrorMessage(true);
        return;
    }
    console.log('this is success if you see this-- but should it be?');
    setUsername('');
    setPassword('');
    setSuccess(true);
    navigate('/login');
}

    return (
        <div>
        <div className='h-52 w-52 border-gray-400 bg-slate-200 rounded-md m-auto mt-56 flex flex-col'>
        
        <div className='flex flex-col gap-1 mt-8 mb-2 pl-2 pr-2'>
            <div>
                <input value={username} placeholder="username"
                onChange={e=>setUsername(e.target.value)}
                className="p-1 outline-none" name="username"/>
            </div>
            <div>
                <input value={password} placeholder="password"
                onChange={e=>setPassword(e.target.value)}
                className="p-1 outline-none" name="password" type="password"
                />
            </div>
            {errorMessage && <div className=' font-extrabold text-red-600 text-xs'>* invalid signup credentials</div>}
        </div>
        <div className='flex justify-center mt-4'>
        <Link><Button name='Sign Up' clickFunction={attemptSignUp}/></Link>
        </div>
        </div>
        <div className=' text-center text-sm flex justify-center gap-1'>already have an account? 
        <div className='font-bold'>
        <Link to='/login'>
        Log in
        </Link>
        </div>
        </div>
        </div>
    )
};

export default SignUp;