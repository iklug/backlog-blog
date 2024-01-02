import { useState, useEffect } from "react";

const Login = () => {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [submitting, setSubmitting] = useState(false);
const [flip, setFlip] = useState(false);
const [logout, setLogout] = useState(false);
const [refresh, setRefresh] = useState(false);
const [sign, setSign] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);



function setJWT(token){
    console.log('access token set');
    sessionStorage.setItem('jwt', token);
    
}
function getJWT(){
    console.log('attempting to access token');
    return sessionStorage.getItem('jwt');
}
function setRefreshToken(token){
    console.log('refresh token set');
    sessionStorage.setItem('refreshToken', token)
}
function getRefreshToken(){
   return sessionStorage.getItem('refreshToken');
}
useEffect(()=>{
    if(refresh){const createAccess = async()=>{
        try {
            let token = getRefreshToken();
            const request = await fetch("http://localhost:3000/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token}),
            });
            if(!request.ok){
                throw new Error('no access');
            }
            const data = await request.json();
            console.log(data);
            setJWT(data.accessToken);
        } catch (error) {
            console.error(error);
        }
    }
    createAccess();
    setRefresh(false);
}
}, [refresh])


useEffect(()=>{
if(flip){
    const checkUser = async() =>{
        try {

            let token = getJWT();
            console.log('is this the problem // ',token)
            const request = await fetch("http://localhost:3000/api", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if(!request.ok){
           throw new Error('bad request');
        }
        const data = await request.json();
        console.log(data);
        } catch (error) {
            console.error(error);
        }
    } 
    checkUser();
    setFlip(false);

}
}, [flip]);

useEffect(()=>{
    if(sessionStorage.refreshToken && !loggedIn){
        const rememberLogin = async() =>{
            let token = getJWT();
            const request = await fetch("http://localhost:3000/api", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await request.json();
            console.log(data);
        }
        rememberLogin();
        setLoggedIn(true);
    }
    if(submitting){
        const submitLogin = async() =>{
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
                throw new Error("Request yo face!");
            }
            const data = await request.json();
            setJWT(data.accessToken);
            setRefreshToken(data.refreshToken);

            } catch (error) {
                console.error('Error sending data to squirrel:', error);
            }
        } 
        submitLogin();
        setUsername('');
        setPassword('');
        setSubmitting(false);
        setLoggedIn(true);
        console.log('logged in', username);
    
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [submitting]);
// [] empty dependency array : it is only called once the page renders
// [state] if it has 1 state variable, it is called on first render, and whenever that state is updated
//
useEffect(()=>{
    if(logout){
        const submitLogout = async() =>{
            try {
                let token = getJWT();
                const request = await fetch("http://localhost:3000/logout", {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
            
            }}
            );
            if(!request.ok){
                throw new Error("Request failed!");
            }
            const data = await request.json();
            console.log(data);
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
        } 
        submitLogout();
        setUsername('');
        setPassword('');
        setLoggedIn(false);
        sessionStorage.clear();
        setLogout(false);
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [logout]);

useEffect(()=>{
    if(sign){
        const submitSignup = async() =>{
            try {
                const request = await fetch("http://localhost:3000/sign-up", {
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
                throw new Error("Request yo face!");
            }
            const data = await request.json();
            console.log(data);
            } catch (error) {
                console.error('Error sending data to squirrel:', error);
            }
        } 
        submitSignup();
        setUsername('');
        setPassword('');
        
        setSign(false);
        console.log('signed up', username);
    
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [sign]);
    return (
        <div>
            <div>
                <div>Please Log In</div>
            </div>
            <div>
                <input value={username} placeholder="username" 
                onChange={e=>setUsername(e.target.value)}
                className="" name="username"
                />
            </div>
            <div>
                <input value={password} placeholder="password" 
                onChange={e=>setPassword(e.target.value)}
                className="" name="password" type="password"
                />
            </div>
            {!loggedIn && <div>
                <button onClick={()=>setSubmitting(true)}>
                    Log in
                </button>
            </div> }
            <div>
                <button onClick={()=>setFlip(true)}>
                    Check current user
                </button>
            </div>
            <div>
                <button onClick={()=>setLogout(true)}>
                    Logout
                </button>
            </div>
            <div>
                <button onClick={()=>setRefresh(true)}>
                    Request New Token
                </button>
            </div>
            <div>
                <button onClick={()=>setSign(true)}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Login;