
const setUsernameFromSession = async () => {
    
       if(!sessionStorage.getItem('username')){

            try {
                const request = await fetch('https://backlog-blog.fly.dev/session', {
                credentials: 'include',
            });
                if(!request.ok){
                    throw new Error('no active session, please log in');
                }
                const userCredentials = await request.json();
                sessionStorage.setItem('username', userCredentials.username);
                sessionStorage.setItem('admin', userCredentials.admin);
        } catch (error) {
                console.error(error);

    }}
}

export default setUsernameFromSession;