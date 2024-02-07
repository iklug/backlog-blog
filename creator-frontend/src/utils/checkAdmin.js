
export const setSessionAdmin = (boolean) => {
    
    sessionStorage.setItem('admin', boolean);

}

export const getSessionAdmin = async () => {

    return sessionStorage.getItem('admin');

}

