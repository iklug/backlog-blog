import Button from '../components/Button'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { authAdmin, authUser, setUsername, selectAuth } from '../redux/authSlice';
import {useDispatch, useSelector} from 'react-redux';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    

    const dispatch = useDispatch();

    const setJWT = (token) => {
        sessionStorage.setItem('jwt', token);
    }
    const getJWT = () => {
        return sessionStorage.getItem('jwt');
    }
    const setRefreshToken = (token) => {
        sessionStorage.setItem('refreshToken', token);
    }
    const getRefreshToken = ()=> {
        return sessionStorage.getItem('refreshToken');
    }
const navigate = useNavigate();


const attemptLogIn = async() => {
    try {
        const request = await fetch("http://localhost:3000/log-in", {
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
        setJWT(data.accessToken);

        const [header, payload, signature] = data.accessToken.split('.');
        const decodePayload = JSON.parse(atob(payload));
        const theUsername = decodePayload.username;
        console.log('this is apparently the jwt decoded username:', theUsername);


        setRefreshToken(data.refreshToken);
        console.log('these are the tokens:',data);
    } catch(error){
        console.error(error);
        setUsername('');
        setPassword('');
        setErrorMessage(true);
        return;
    }
    console.log('this is success if you see this-- but should it be?');
    sessionStorage.setItem('username', username);
    username === 'admin' ? dispatch(authAdmin()) : dispatch(authUser());
    setUsername('');
    setPassword('');
    // navigate('/');
}

const auth = useSelector(selectAuth);
console.log('🥑',auth); 
if(auth !== ''){
    navigate('/');
}
    // useEffect(()=>{
    //     if(loggingIn){
    //     const loginUser = async() => {
            
    //                 try {
    //                     const request = await fetch("http://localhost:3000/log-in", {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify({
    //                         username: username,
    //                         password: password
    //                     })  
    //                 });
    //                 if(!request.ok){
    //                     throw new Error("unable to perform request");
    //                 }
    //                 const data = await request.json();
    //                 setJWT(data.accessToken);
    //                 setRefreshToken(data.refreshToken);
    //                 console.log(data);
    //                 } catch (error) {
    //                     console.error(error);
    //                     setUsername('');
    //                     setPassword('');
    //                     setLoggingIn(false);
    //                     return;
    //                 }
    //             } 
    //             console.log('but this still happens??')
    //             loginUser();
    //             console.log('logged in', username);
    //             setUsername('');
    //         setPassword('');
    //         setLoggingIn(false);
    //         navigate('/');
    //         }
        
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     }, [loggingIn]);


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
            {errorMessage && <div className=' font-extrabold text-red-600 text-xs'>* incorrect login credentials</div>}
        </div>
        <div className='flex justify-center mt-4'>
        <Link><Button name='Log In' clickFunction={attemptLogIn}/></Link>
        </div>
        </div>
        <div className=' text-center text-sm flex justify-center gap-1'>don't have an account? 
        <div className='font-bold'>
        <Link to='/signup'>
        Sign up
        </Link>
        </div>
        </div>
        </div>
    )
};

export default Login;